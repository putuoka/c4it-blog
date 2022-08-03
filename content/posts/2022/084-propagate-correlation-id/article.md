---
title: "How to propagate HTTP Headers (and  Correlation IDs) using HttpClients in C#"
path: '/blog/propagate-httpheader-and-correlation-id'
tags: ["CSharp", "DotNet","MainArticle"]
featuredImage: "./cover.png"
excerpt: "Propagating HTTP Headers can be useful, especially when dealing with Correlation IDs. It's time to customize our HttpClients!"
created: 2022-08-02
updated: 2022-08-03
---

Imagine this: you have a system made up of different applications that communicate via HTTP. There's some sort of entry point, exposed to the clients, that orchestrates the calls to the other applications. How do you correlate those requests?

A good idea is to use a **Correlation ID**: one common approach for HTTP-based systems is passing a value to the "public" endpoint using HTTP headers; that value will be passed to all the other systems involved in that operation to say that "hey, these incoming requests in the internal systems happened because of THAT SPECIFIC request in the public endpoint". Of course, it's more complex than this, but you got the idea.

Now. How can we propagate an HTTP Header in .NET? I found [this solution on GitHub](https://gist.github.com/davidfowl/c34633f1ddc519f030a1c0c5abe8e867), provided by no less than David Fowler. In this article, I'm gonna dissect his code to see how he built this solution.

**Important update**: there's a NuGet package that implements these functionalities: `Microsoft.AspNetCore.HeaderPropagation`. Consider this article as an excuse to understand what happens behind the scenes of an HTTP call, and use it to learn how to customize and extend those functionalities. [Here's](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-6.0#header-propagation-middleware) how to integrate that package.

## Just interested in the C# methods?

As I said, I'm not reinventing anything new: the source code I'm using for this article is available on GitHub (see link above), but still, I'll paste the code here, for simplicity.

First of all, we have two extension methods that add some custom functionalities to the `IServiceCollection`.

```cs
public static class HeaderPropagationExtensions
{
    public static IServiceCollection AddHeaderPropagation(this IServiceCollection services, Action<HeaderPropagationOptions> configure)
    {
        services.AddHttpContextAccessor();
        services.ConfigureAll(configure);
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IHttpMessageHandlerBuilderFilter, HeaderPropagationMessageHandlerBuilderFilter>());
        return services;
    }

    public static IHttpClientBuilder AddHeaderPropagation(this IHttpClientBuilder builder, Action<HeaderPropagationOptions> configure)
    {
        builder.Services.AddHttpContextAccessor();
        builder.Services.Configure(builder.Name, configure);
        builder.AddHttpMessageHandler((sp) =>
        {
            var options = sp.GetRequiredService<IOptionsMonitor<HeaderPropagationOptions>>();
            var contextAccessor = sp.GetRequiredService<IHttpContextAccessor>();

            return new HeaderPropagationMessageHandler(options.Get(builder.Name), contextAccessor);
        });

        return builder;
    }
}
```

Then we have a Filter that will be used to customize how the HttpClients must be built.

```cs
internal class HeaderPropagationMessageHandlerBuilderFilter : IHttpMessageHandlerBuilderFilter
{
    private readonly HeaderPropagationOptions _options;
    private readonly IHttpContextAccessor _contextAccessor;

    public HeaderPropagationMessageHandlerBuilderFilter(IOptions<HeaderPropagationOptions> options, IHttpContextAccessor contextAccessor)
    {
        _options = options.Value;
        _contextAccessor = contextAccessor;
    }

    public Action<HttpMessageHandlerBuilder> Configure(Action<HttpMessageHandlerBuilder> next)
    {
        return builder =>
        {
            builder.AdditionalHandlers.Add(new HeaderPropagationMessageHandler(_options, _contextAccessor));
            next(builder);
        };
    }
}
```

next, a simple class that holds the headers we want to propagate 

```cs
public class HeaderPropagationOptions
{
    public IList<string> HeaderNames { get; set; } = new List<string>();
}
```

and, lastly, the handler that actually propagates the headers.

```cs
public class HeaderPropagationMessageHandler : DelegatingHandler
{
    private readonly HeaderPropagationOptions _options;
    private readonly IHttpContextAccessor _contextAccessor;

    public HeaderPropagationMessageHandler(HeaderPropagationOptions options, IHttpContextAccessor contextAccessor)
    {
        _options = options;
        _contextAccessor = contextAccessor;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
    {
        if (_contextAccessor.HttpContext != null)
        {
            foreach (var headerName in _options.HeaderNames)
            {
                // Get the incoming header value
                var headerValue = _contextAccessor.HttpContext.Request.Headers[headerName];
                if (StringValues.IsNullOrEmpty(headerValue))
                {
                    continue;
                }

                request.Headers.TryAddWithoutValidation(headerName, (string[])headerValue);
            }
        }

        return base.SendAsync(request, cancellationToken);
    }
}
```

Ok, and how can we use all of this?

It's quite easy: if you want to propagate the *my-correlation-id* header for all the HttpClients created in your application, you just have to add this line to your Startup method.

```cs
builder.Services.AddHeaderPropagation(options => options.HeaderNames.Add("my-correlation-id"));
```

Time to study this code!

##  How to "enrich" HTTP requests using DelegatingHandler

Let's start with the `HeaderPropagationMessageHandler` class:

```cs
public class HeaderPropagationMessageHandler : DelegatingHandler
{
    private readonly HeaderPropagationOptions _options;
    private readonly IHttpContextAccessor _contextAccessor;

    public HeaderPropagationMessageHandler(HeaderPropagationOptions options, IHttpContextAccessor contextAccessor)
    {
        _options = options;
        _contextAccessor = contextAccessor;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
    {
        if (_contextAccessor.HttpContext != null)
        {
            foreach (var headerName in _options.HeaderNames)
            {
                // Get the incoming header value
                var headerValue = _contextAccessor.HttpContext.Request.Headers[headerName];
                if (StringValues.IsNullOrEmpty(headerValue))
                {
                    continue;
                }

                request.Headers.TryAddWithoutValidation(headerName, (string[])headerValue);
            }
        }

        return base.SendAsync(request, cancellationToken);
    }
}
```

This class lies in the middle of the HTTP Request pipeline. It can extend the functionalities of HTTP Clients because it inherits from `System.Net.Http.DelegatingHandler`.

If you recall [from a previous article](https://www.code4it.dev/blog/testing-httpclientfactory-moq#mocking-httpmessagehandler), the `SendAsync` method is the real core of any HTTP call performed using .NET's `HttpClients`, and here we're enriching that method by propagating some HTTP headers.


```cs
 protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
{
    if (_contextAccessor.HttpContext != null)
    {
        foreach (var headerName in _options.HeaderNames)
        {
            // Get the incoming header value
            var headerValue = _contextAccessor.HttpContext.Request.Headers[headerName];
            if (StringValues.IsNullOrEmpty(headerValue))
            {
                continue;
            }

            request.Headers.TryAddWithoutValidation(headerName, (string[])headerValue);
        }
    }

    return base.SendAsync(request, cancellationToken);
}
```

By using `_contextAccessor` we can access the current HTTP Context. From there, we retrieve the current HTTP headers, check if one of them must be propagated (by looking up `_options.HeaderNames`), and finally, we add the header to the outgoing HTTP call by using `TryAddWithoutValidation`.

<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/Z8koEOoTT2rgghCzXK" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/nickelodeon-nick-all-that-clone-Z8koEOoTT2rgghCzXK">HTTP Headers are "cloned" and propagated</a></p>

Notice that we've used `TryAddWithoutValidation` instead of `Add`: in this way, we can use whichever HTTP header key we want without worrying about invalid names (such as the ones with a new line in it). Invalid header names will simply be ignored, as opposed to the Add method that will throw an exception.


Finally, we continue with the HTTP call by executing `base.SendAsync`, passing the `HttpRequestMessage` object now enriched with additional headers.

## Using HttpMessageHandlerBuilder to configure how HttpClients must be built 

The `Microsoft.Extensions.Http.IHttpMessageHandlerBuilderFilter` interface allows you to apply some custom configurations to the `HttpMessageHandlerBuilder` right before the `HttpMessageHandler` object is built.

```cs
internal class HeaderPropagationMessageHandlerBuilderFilter : IHttpMessageHandlerBuilderFilter
{
    private readonly HeaderPropagationOptions _options;
    private readonly IHttpContextAccessor _contextAccessor;

    public HeaderPropagationMessageHandlerBuilderFilter(IOptions<HeaderPropagationOptions> options, IHttpContextAccessor contextAccessor)
    {
        _options = options.Value;
        _contextAccessor = contextAccessor;
    }

    public Action<HttpMessageHandlerBuilder> Configure(Action<HttpMessageHandlerBuilder> next)
    {
        return builder =>
        {
            builder.AdditionalHandlers.Add(new HeaderPropagationMessageHandler(_options, _contextAccessor));
            next(builder);
        };
    }
}
```

The `Configure` method allows you to customize how the `HttpMessageHandler` will be built: we are adding a new instance of the `HeaderPropagationMessageHandler` class we've seen before to the current `HttpMessageHandlerBuilder`'s `AdditionalHandlers` collection. All the handlers registered in the list will then be used to build the `HttpMessageHandler` object we'll use to send and receive requests.

<div style="width:10    0%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/Yj6d4OMmDV3bnYtOow" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/CBeebiesHQ-painting-diy-Yj6d4OMmDV3bnYtOow">via GIPHY</a></p>

By having a look at the definition of `HttpMessageHandlerBuilder` you can grasp a bit of what happens when we're creating HttpClients in .NET.

```cs
namespace Microsoft.Extensions.Http
{
  
    public abstract class HttpMessageHandlerBuilder
    {
        protected HttpMessageHandlerBuilder();

        public abstract IList<DelegatingHandler> AdditionalHandlers { get; }
     
        public abstract string Name { get; set; }
     
        public abstract HttpMessageHandler PrimaryHandler { get; set; }
    
        public virtual IServiceProvider Services { get; }

        protected internal static HttpMessageHandler CreateHandlerPipeline(HttpMessageHandler primaryHandler, IEnumerable<DelegatingHandler> additionalHandlers);
     
        public abstract HttpMessageHandler Build();
    }
}
```

Ah, and remember the wise words you can read in the [docs of that class](https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.http.httpmessagehandlerbuilder):

> The Microsoft.Extensions.Http.HttpMessageHandlerBuilder is registered in the service collection as a transient service.

Nice 😎

## Share the behavior with all the HTTP Clients in the .NET application

Now that we've defined the custom behavior of HTTP clients, we need to integrate it into our .NET application.

```cs
public static IServiceCollection AddHeaderPropagation(this IServiceCollection services, Action<HeaderPropagationOptions> configure)
{
    services.AddHttpContextAccessor();
    services.ConfigureAll(configure);
    services.TryAddEnumerable(ServiceDescriptor.Singleton<IHttpMessageHandlerBuilderFilter, HeaderPropagationMessageHandlerBuilderFilter>());
    return services;
}
```

Here, we're gonna extend the `IServiceCollection` with those functionalities. At first, we're adding `AddHttpContextAccessor`, which allows us to access the current HTTP Context (the one we've used in the `HeaderPropagationMessageHandler` class).

Then, `services.ConfigureAll(configure)` registers an `HeaderPropagationOptions` that will be used by `HeaderPropagationMessageHandlerBuilderFilter`. Without that line, we won't be able to specify the names of the headers to be propagated.

Finally, we have this line:

```cs
services.TryAddEnumerable(ServiceDescriptor.Singleton<IHttpMessageHandlerBuilderFilter, HeaderPropagationMessageHandlerBuilderFilter>());
```

Honestly, I haven't understood it thoroughly: I thought that it allows us to use more than one class implementing `IHttpMessageHandlerBuilderFilter`, but apparently if we create a sibling class and add them both using `Add`, everything works the same. **If you know what this line means, drop a comment below! 👇**

## Integrating the HTTP Header propagation in a .NET 6 API

Wherever you access the ServiceCollection object (may it be in the Startup or in the Program class), you can propagate HTTP headers for every HttpClient by using

```cs
builder.Services.AddHeaderPropagation(options =>
    options.HeaderNames.Add("my-correlation-id")
);
```

Yes, `AddHeaderPropagation` is the method we've seen in the previous paragraph! 

## Seeing it in action

Now we have all the pieces in place.

It's time to run it 😎

To fully understand it, I strongly suggest forking [this repository I've created](https://github.com/code4it-dev/PropagateCorrelationIdOnHttpClients) and running it locally, placing some breakpoints here and there.

As a recap: in the Program class, I've added these lines to create a named `HttpClient` specifying its `BaseAddress` property. Then I've added the `HeaderPropagation` as we've seen before.

```cs
builder.Services.AddHttpClient("items")
                    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://en5xof8r16a6h.x.pipedream.net/"));

builder.Services.AddHeaderPropagation(options =>
    options.HeaderNames.Add("my-correlation-id")
);
```

There's also a simple Controller that acts as an entry point and that, using an HttpClient, sends data to another endpoint (the one defined in the previous snippet). 

```cs
[HttpPost]
public async Task<IActionResult> PostAsync([FromQuery] string value)
{
    var item = new Item(value);

    var httpClient = _httpClientFactory.CreateClient("items");
    await httpClient.PostAsJsonAsync("/", item);
    return NoContent();
}
```

### What happens at start-up time

When a .NET application starts up, the Main method in the Program class acts as an entry point and registers all the dependencies and configurations required.

We will then call `builder.Services.AddHeaderPropagation`, which is the method present in the `HeaderPropagationExtensions` class.

All the configurations are then set, but no actual operations are being executed.

The application then starts normally, waiting for incoming requests.

### What happens at runtime

Now, when we call the `PostAsync` method by passing an HTTP header such as  *my-correlation-id:123*, things get interesting.

The first operation is 

```cs
var httpClient = _httpClientFactory.CreateClient("items");
```

While creating the HttpClient, the engine is calling all the registered `IHttpMessageHandlerBuilderFilter` and calling their `Configure` method. So, you'll see the execution moving to `HeaderPropagationMessageHandlerBuilderFilter`'s `Configure`. 

```cs
public Action<HttpMessageHandlerBuilder> Configure(Action<HttpMessageHandlerBuilder> next)
{
    return builder =>
    {
        builder.AdditionalHandlers.Add(new HeaderPropagationMessageHandler(_options, _contextAccessor));
        next(builder);
    };
}
```

Of course, you're also executing the `HeaderPropagationMessageHandler` constructor.
 
The `HttpClient` is now ready: when we call `httpClient.PostAsJsonAsync("/", item)` we're also executing all the registered `DelegatingHandler` instances, such as our `HeaderPropagationMessageHandler`. In particular, we're executing the `SendAsync` method and adding the required HTTP Headers to the outgoing HTTP calls.

We will then see the same HTTP Header on the destination endpoint.

<div style="width:100%;height:0;padding-bottom:60%;position:relative;"><iframe src="https://giphy.com/embed/8UF0EXzsc0Ckg" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/finally-atlast-itsover-8UF0EXzsc0Ckg"> We did it!</a></p>

## Propagating CorrelationId to a specific HttpClient

You can also specify which headers need to be propagated on single HTTP Clients:

```cs
public static IHttpClientBuilder AddHeaderPropagation(this IHttpClientBuilder builder, Action<HeaderPropagationOptions> configure)
{
    builder.Services.AddHttpContextAccessor();
    builder.Services.Configure(builder.Name, configure);

    builder.AddHttpMessageHandler((sp) =>
    {
        var options = sp.GetRequiredService<IOptionsMonitor<HeaderPropagationOptions>>();
        var contextAccessor = sp.GetRequiredService<IHttpContextAccessor>();

        return new HeaderPropagationMessageHandler(options.Get(builder.Name), contextAccessor);
    });

    return builder;
}
```

Which works similarly, but registers the Handler only to a specific HttpClient.

For instance, you can have 2 distinct HttpClient that will propagate only a specific set of HTTP Headers:

```cs
builder.Services.AddHttpClient("items")
        .AddHeaderPropagation(options => options.HeaderNames.Add("my-correlation-id"));

builder.Services.AddHttpClient("customers")
        .AddHeaderPropagation(options => options.HeaderNames.Add("another-correlation-id"));
```

## Further readings

Finally, some additional resources if you want to read more.

For sure, you should check out (and star⭐) David Fowler's code:

🔗 [Original code | GitHub](https://gist.github.com/davidfowl/c34633f1ddc519f030a1c0c5abe8e867)

If you're not sure about what are extension methods (and you cannot respond to this question: *How does inheritance work with extension methods?*), then you can have a look at this article:

🔗 [How you can create extension methods in C# | Code4IT](https://www.code4it.dev/blog/csharp-extension-methods)

We heavily rely on HttpClient and HttpClientFactory. How can you test them? Well, by mocking the `SendAsync` method!

🔗 [How to test HttpClientFactory with Moq | Code4IT](https://www.code4it.dev/blog/testing-httpclientfactory-moq)

We've seen which is the role of `HttpMessageHandlerBuilder` when building `HttpClient`s. You can explore that class starting from the documentation.

🔗 [HttpMessageHandlerBuilder Class | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.http.httpmessagehandlerbuilder)

We've already seen how to inject and use `HttpContext` in our applications:

🔗 [How to access the HttpContext in .NET API](https://www.code4it.dev/blog/inject-httpcontext)

Finally, the repository that you can fork to toy with it:

🔗 [PropagateCorrelationIdOnHttpClients | GitHub](https://github.com/code4it-dev/PropagateCorrelationIdOnHttpClients)


## Conclusion

What a ride!

We've seen how to add functionalities to `HttpClient`s and to HTTP messages. All integrated into the .NET pipeline!

We've learned how to propagate generic HTTP Headers. Of course, you can choose any custom HttpHeader and promote one of them as **CorrelationId**.

Again, I invite you to download the code and toy with it - it's incredibly interesting 😎

Happy coding!

🐧
