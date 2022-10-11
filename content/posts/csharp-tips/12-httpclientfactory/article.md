---
title: "C# Tip: use IHttpClientFactory to generate HttpClient instances"
path: "/csharptips/use-httpclientfactory-instead-of-httpclient"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "Initializing HttpClient instances can expose you to Socket Exhaustion problems. You should use IHttpClientFactory instead"
created: 2022-06-07
updated: 2022-06-07
---

## The problem with HttpClient

When you create lots of `HttpClient` instances, you may incur **Socket Exhaustion**.

This happens because sockets are a finite resource, and they are not released exactly when you 'Dispose' them, but a bit later. So, when you create lots of clients, you may terminate the available sockets.

Even with `using` statements you may end up with Socket Exhaustion.

```cs
class ResourceChecker
{
    public async Task<bool> ResourceExists(string url)
    {
        using (HttpClient client = new HttpClient())
        {
            var response = await client.GetAsync(url);
            return response.IsSuccessStatusCode;
        }
    }
}
```

Actually, the real issue lies in the disposal of `HttpMessageHandler` instances. With simple `HttpClient` objects, you have no control over them.

## Introducing HttpClientFactory

The `HttpClientFactory` class creates `HttpClient` instances for you.

```cs
class ResourceChecker
{
    private IHttpClientFactory _httpClientFactory;

    public ResourceChecker(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<bool> ResourceExists(string url)
    {
        HttpClient client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync(url);
        return response.IsSuccessStatusCode;
    }
}
```

The purpose of `IHttpClientFactory` is to solve that issue with `HttpMessageHandler`.

An interesting feature of `IHttpClientFactory` is that you can customize it with some general configurations that will be applied to all the `HttpClient` instances generated in a certain way. For instance, you can define HTTP Headers, Base URL, and other properties in a single point, and have those properties applied everywhere.

## How to add it to .NET Core APIs or Websites

How can you use HttpClientFactory in your .NET projects?

If you have the Startup class, you can simply add an instruction to the `ConfigureServices` method:

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpClient();
}
```

You can find that extension method under the `Microsoft.Extensions.DependencyInjection` namespace.

## Wrapping up

In this article, we've seen why you should not instantiate HttpClients manually, but instead, you should use `IHttpClientFactory`.

Happy coding!

🐧
