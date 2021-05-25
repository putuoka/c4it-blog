---
title: "How to Ping an endpoint with C#"
path: "/blog/ping-endpoint-csharp"
tags: ["CSharp"]
featuredImage: "./cover.jpg"
excerpt: "How to effectively ping an endpoint in C#? Don't use the HttpClient, when .NET provides a Ping class to perform all these operations."
created: 2020-11-17
updated: 2020-11-17
---

How would you know if a remote endpoint is up and running? When you use the command line, you can run the `ping` command and see the result, like this:

```txt
❯ ping code4it.dev

Pinging code4it.dev [165.22.65.139] with 32 bytes of data:
Reply from 165.22.65.139: bytes=32 time=17ms TTL=51
Reply from 165.22.65.139: bytes=32 time=20ms TTL=51
Reply from 165.22.65.139: bytes=32 time=15ms TTL=51
Reply from 165.22.65.139: bytes=32 time=16ms TTL=51

Ping statistics for 165.22.65.139:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 15ms, Maximum = 20ms, Average = 17ms
```

But what if you need to fetch that result programmatically with C#?

## HttpClient - a bad idea

The first approach you can think of is to send an HTTP request to that endpoint and to see if you receive some response.

```cs
private static async Task<bool> PingWithHttpClient()
{
    string hostUrl = "https://www.code4it.dev/";

    var httpClient = new HttpClient();
    HttpRequestMessage request = new HttpRequestMessage
    {
        RequestUri = new Uri(hostUrl),
        Method = HttpMethod.Head
    };
    var result = await httpClient.SendAsync(request);
    return result.IsSuccessStatusCode;
}
```

Notice that I don't request the whole content, but I perform a _HEAD_ operation to get only the response headers. To know more about this HTTP method, [check out the MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD "HEAD documentation on MDN").

So, what can we say about this snippet of code? __Does it work? _Yes_. Is it the best choice? _No_.__ Why?

There are at least 2 cases that will show you why you shouldn't use it.

What if the whole site is under authentication? Well, the site would be actually reachable, but since we are not including authentication headers or cookies, the `IsSuccessStatusCode` will return `false`. You can try it by setting _https://httpstat.us/401_ as `hostUrl`.

Also, let's think about Web APIs. Usually, the root does not represent a valid endpoint. So, you will get a 404 instead of the expected response even if the system is working correctly.

## Ping class: a better idea

The best and simples way to perform ping operations is relying on the `Ping` class on the `System.Net.NetworkInformation` namespace. This class allows you to _ping_ an endpoint and to check all the values that you usually get when you run this command on the command line.

```cs
private static async Task<bool> PingAsync()
{
    var hostUrl = "www.code4it.dev";

    Ping ping = new Ping();

    PingReply result = await ping.SendPingAsync(hostUrl);
    return result.Status == IPStatus.Success;
}
```

Yes, that's as simple as it appears! But let's have a look at each line.

```cs
var hostUrl = "www.code4it.dev";
```

Here I'm defining which host must be checked. As you already do with the command line, you have to __exclude both the protocol (_http_ and _https_) and every following path and query string__.

```cs
Ping ping = new Ping();
```

Simply, we are creating a new `Ping` object. No parameters in the constructor, no overloads. Easy-peasy.

```cs
PingReply result = await ping.SendPingAsync(hostUrl);
```

Here I'm performing the _ping_ operation in the simplest way, by specifying only the destination host.
Some other overloads allow you, for instance, to specify a timeout (in milliseconds) for the request.

Once you retrieve the `PingReply` object you can get some useful info:

```cs
public IPAddress Address { get; }
public byte[] Buffer { get; }
public PingOptions Options { get; }
public long RoundtripTime { get; }
public IPStatus Status { get; }
```

With the `Address` field, you can perform lots of operations, like mapping that IP address to an _IPv4_ or _IPv6_ address and get some advanced properties, like the `AddressFamily`. Or, simply, you might want to print the IP value, and you can do it with a simple `ToString`.

Of course, you can also get the _RTT (round-trip time)_  expressed in milliseconds.

The last thing to check is the actual status.

```cs
return result.Status == IPStatus.Success;
```

`IPStatus` is an _enum_ with lots of different values. Among them, we can find

```cs
public enum IPStatus
{
    Unknown = -1,
    Success = 0,
    DestinationHostUnreachable = 11003,
    DestinationProtocolUnreachable = 11004,
    DestinationPortUnreachable = 11005,
    TtlExpired = 11013,
    BadDestination = 11018,
    DestinationUnreachable = 11040,
    TimeExceeded = 11041
}
```

## The synchronous way 

We've seen how to ping an endpoint asynchronously. What if we need the synchronous way?

Well, there is also this possibility, but with a method called `Send`. I won't repeat the example, it's almost identical to the one we've already seen.

I just want to point out that the library has a small discrepancy in the names for the methods.

The asynchronous method that we've used before is called `SendPingAsync`, but the synchronous method is called `Send`. Where is the `SendPing` method? It doesn't exist. And what about `SendAsync`? Well, it actually exists, but it requires different parameters and, even worse, it returns `null` instead of a `PingReply` object.

## Bonus tip: how to get the Hostname for a URL

As I said, to perform a _ping_ request you need to use only the hostname, and remove all the other parts of the URL, like the protocol, the query string and so on.
If you don't pass the correct value to the `SendPingAsync` method, you will get a `System.Net.NetworkInformation.PingException` exception with the message _No such host is known_.

How can you get only the hostname? You could parse the string, extract only the parts that you need using a regex or something similar. Or you can simply transform your URL into a `System.Uri` object and extract the host property.

```cs
var fullUrl = new Uri("https://www.code4it.dev/blog/openapi-code-generation-vs2019");
var host = fullUrl.Host; // www.code4it.dev
```

Easy, right?

## Wrapping up

In my experience, I've rarely seen this way to ping an endpoint. In most of the projects I've worked on, we used the `HttpClient` way. But it was only because we didn't know of the existence of this class.

If you want to know more about this class, you can directly refer to the [official .NET documentation](https://docs.microsoft.com/en-us/dotnet/api/system.net.networkinformation.ping?view=netcore-3.1 "Ping class on dotnet documentation").

Also, remember that you can't run the _ping_ command on Azure App Service. If you are interested, have a look [at this article](/blog/tcpping-azure-portal) where I explain why and how you can perform a similar operation.

Happy coding!
