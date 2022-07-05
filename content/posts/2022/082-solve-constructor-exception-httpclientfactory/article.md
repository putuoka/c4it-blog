---
title: "How to solve InvalidOperationException for constructors using HttpClientFactory in C#"
path: '/blog/solve-constructor-exception-with-httpclientfactory'
tags: ["MainArticle", "CSharp", "DotNet"]
featuredImage: "./cover.png"
excerpt: "A suitable constructor for type 'X' could not be located. What a strange error message! Luckily it's easy to solve."
created: 2022-07-05
updated: 2022-07-05
---

A few days ago I was preparing the demo for a new article. The demo included a class with an `IHttpClientFactory` service injected into the constructor. Nothing more.

Then, running the application (well, actually, executing the code), this error popped out:

> System.InvalidOperationException: A suitable constructor for type 'X' could not be located. Ensure the type is concrete and all parameters of a public constructor are either registered as services or passed as arguments. Also ensure no extraneous arguments are provided.

How to solve it? It's easy. But first, let me show you what I did in the wrong version.

## Setting up the wrong example

For this example, I created an elementary project.
It's a .NET 7 API project, with only one controller, `GenderController`, which calls another service defined in the `IGenderizeService` interface.

```cs
public interface IGenderizeService
{
    Task<GenderProbability> GetGenderProbabiliy(string name);
}
```

`IGenderizeService` is implemented by a class, `GenderizeService`, which is the one that fails to load and, therefore, causes the exception to be thrown. The class calls an external endpoint, parses the result, and then returns it to the caller:

```cs
public class GenderizeService : IGenderizeService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public GenderizeService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<GenderProbability> GetGenderProbabiliy(string name)
    {
        var httpClient = _httpClientFactory.CreateClient();

        var response = await httpClient.GetAsync($"?name={name}");

        var result = await response.Content.ReadFromJsonAsync<GenderProbability>();

        return result;
    }
}
```

Finally, I've defined the services in the Program class, and then I've specified which is the base URL for the HttpClient instance generated in the `GenderizeService` class:

```cs
// some code

builder.Services.AddScoped<IGenderizeService, GenderizeService>();

builder.Services.AddHttpClient<IGenderizeService, GenderizeService>(
    client => client.BaseAddress = new Uri("https://api.genderize.io/")
    );

var app = builder.Build();

// some more code
```

That's it! Can you spot the error?

## 2 ways to solve the error

The error was quite simple, but it took me a while to spot:

In the constructor I was injecting an `IHttpClientFactory`:

```cs
public GenderizeService(IHttpClientFactory httpClientFactory)
```

while in the host definition I was declaring an `HttpClient` for a specific class:

```cs
builder.Services.AddHttpClient<IGenderizeService, GenderizeService>
```
Apparently, even if we've specified how to create an instance for a specific class, we could not build it using an IHttpClientFactory.

So, here are 2 ways to solve it.

### Use named HttpClient in HttpClientFactory

Named HttpClients are a helpful way to define a specific HttpClient and use it across different services.

It's as simple as assigning a name to an HttpClient instance and then using the same name when you need that specific client.

So, define it in the Startup method:

```cs
builder.Services.AddHttpClient("genderize",
            client => client.BaseAddress = new Uri("https://api.genderize.io/")
        );
```

and retrieve it using `CreateClient`:

```cs
public GenderizeService(IHttpClientFactory httpClientFactory)
{
    _httpClientFactory = httpClientFactory;
}

public async Task<GenderProbability> GetGenderProbabiliy(string name)
{
    var httpClient = _httpClientFactory.CreateClient("genderize");

    var response = await httpClient.GetAsync($"?name={name}");

    var result = await response.Content.ReadFromJsonAsync<GenderProbability>();

    return result;
}
```

💡 Quick tip: define the `HttpClient` names in a constant field shared across the whole system!

### Inject HttpClient instead of IHttpClientFactory

The other way is by injecting an `HttpClient` instance instead of an `IHttpClientFactory`.

So we can restore the previous version of the Startup part:

```cs
builder.Services.AddHttpClient<IGenderizeService, GenderizeService>(
            client => client.BaseAddress = new Uri("https://api.genderize.io/")
        );
```

and, instead of injecting an IHttpClientFactory, we can directly inject an `HttpClient` instance:

```cs
public class GenderizeService : IGenderizeService
{
    private readonly HttpClient _httpClient;

    public GenderizeService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GenderProbability> GetGenderProbabiliy(string name)
    {
        //var httpClient = _httpClientFactory.CreateClient("genderize");

        var response = await _httpClient.GetAsync($"?name={name}");

        var result = await response.Content.ReadFromJsonAsync<GenderProbability>();

        return result;
    }
}
```

We no longer need to call `_httpClientFactory.CreateClient` because the injected instance of `HttpClient` is already customized with the settings we've defined at Startup.

## Further readings

I've briefly talked about `HttpClientFactory` in one article of my *C# tips* series:

🔗 [C# Tip: use IHttpClientFactory to generate HttpClient instance | Code4IT](https://www.code4it.dev/csharptips/use-httpclientfactory-instead-of-httpclient)

And, more in detail, I've also talked about one way to mock `HttpClientFactory` instances in unit tests using **Moq**:

🔗 [How to test HttpClientFactory with Moq | Code4IT](https://www.code4it.dev/blog/testing-httpclientfactory-moq)

Finally, why do we need to use HttpClientFactories instead of HttpClients?

🔗 [Use IHttpClientFactory to implement resilient HTTP requests | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests)

## Wrapping up

Yes, it was **that** easy! 

We received the error message

> A suitable constructor for type 'X' could not be located.

because we were mixing two ways to customize and use `HttpClient` instances.

But we've only opened Pandora's box: we will come back to this topic soon!

For now, Happy coding!

🐧
