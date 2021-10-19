---
title: "C# Tip: use the Ping class instead of an HttpClient to ping an endpoint"
path: '/csharptips/ping-endpoint'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt : "Sometimes you need to ping some endpoints. Don't rely on HttpClient, but use the native Ping class."
created: 2021-10-19
updated: 2021-10-19
---

What if you wanted to see if a remote website is up and running?

Probably, the first thing that may come to your mind is to use a common C# class: `HttpClient`. But it may cause you some trouble.

There is another way to ping an endpoint: using the `Ping` class.

## Why not using HttpClient

Say that you need to know if the host at _code4it.dev_ is live. With HttpClient you might use something like this:

```cs
async Task Main()
{
    var url = "https://code4it.dev";

    var isUp = await IsWebsiteUp_Get(url);

    Console.WriteLine("The website is {0}", isUp ? "up" : "down");
}

private async Task<bool> IsWebsiteUp_Get(string url)
{
    var httpClient = new HttpClient(); // yes, I know, I should use HttpClientFactory!
    var httpResponse = await httpClient.GetAsync(url);
    return httpResponse.IsSuccessStatusCode;
}
```

**There are some possible issues with this approach**: what if there is no resource available in the root? You will have to define a specific path. And what happens if the defined resource is under authentication? `IsWebsiteUp_Get` will always return `false`. Even when the site is correctly up.

Also, it is possible that the endpoint does not accept *HttpGet* requests. So, we can use *HttpHead* instead:

```cs
private async Task<bool> IsWebsiteUp_Head(string url)
{
    var httpClient = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage
    {
        RequestUri = new Uri(url),
        Method = HttpMethod.Head // Not GET, but HEAD
    };
    var result = await httpClient.SendAsync(request);
    return result.IsSuccessStatusCode;
}
```

We have the same issues described before, but at least we are not bound to a specific HTTP verb.

By the way, we need to find another way.

## How to use Ping

By using the `Ping` class, we can get rid of those checks and evaluate the status **of the Host**, not of a specific resource.


```cs
private async Task<bool> IsWebsiteUp_Ping(string url)
{
    Ping ping = new Ping();
    var hostName = new Uri(url).Host;

    PingReply result = await ping.SendPingAsync(hostName);
    return result.Status == IPStatus.Success;
}
```

The `Ping` class comes in the `System.Net.NetworkInformation` namespace, and allows you to perform the same operations of the `ping` command you usually send via command line.


## Conclusion

We've seen why you should use `Ping` instead of `HttpClient` to perform a `ping`-like operation.

There's more than this: head to [this more complete article](https://www.code4it.dev/blog/ping-endpoint-csharp "How to Ping an endpoint with C#") to learn more.

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1368979325408706565 "Original tweet on Twitter") or on the comment section below.

🐧
