---
title: "How to test HttpClientFactory with Moq"
path: '/blog/testing-httpclientfactory-moq'
tags: ["CSharp", "Testing" , "MainArticle"]
featuredImage: "./cover.jpg"
excerpt : "Mocking IHttpClientFactory is hard, but luckily we can use some advanced features of Moq to write better tests."
created: 2021-09-28
updated: 2021-09-28
---

When working on any .NET application, one of the most common things you'll see is using dependency injection to inject an `IHttpClientFactory` instance into the constructor of a service. And, of course, you *should* test that service. To write good unit tests, it is a good practice to mock the dependencies to have full control over their behavior. A well-known library to mock dependencies is **Moq**; integrating it is pretty simple: if you have to mock a dependency of type `IMyService`, you can create mocks of it by using `Mock<IMyService>`.

But here comes a problem: mocking `IHttpClientFactory` is not that simple: just using `Mock<IHttpClientFactory>` is not enough.

In this article, we will learn how to mock `IHttpClientFactory` dependencies, how to define the behavior for HTTP calls, and finally, we will deep dive into the advanced features of Moq that allow us to mock that dependency. Let's go!

## Introducing the issue

To fully understand the problem, we need a concrete example.

The following class implements a service with a method that, given an input string, sends it to a remote client using a DELETE HTTP call:

```cs
public class MyExternalService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public MyExternalService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task DeleteObject(string objectName)
    {
        string path = $"/objects?name={objectName}";
        var client = _httpClientFactory.CreateClient("ext_service");

        var httpResponse = await client.DeleteAsync(path);

        httpResponse.EnsureSuccessStatusCode();
    }
}
```

The key point to notice is that we are injecting an instance of `IHttpClientFactory`; we are also creating a new `HttpClient` every time it's needed by using `_httpClientFactory.CreateClient("ext_service")`.

As you may know, you should not instantiate new `HttpClient` objects every time to avoid the risk of **socket exhaustion** (see [links below](#further-readings "Further readings section")).

There is a huge problem with this approach: it's not easy to test it. You cannot simply mock the `IHttpClientFactory` dependency, but you have to manually handle the `HttpClient` and keep track of its internals.

Of course, we will not use real `IHttpClientFactory` instances: we don't want our application to perform real HTTP calls. We need to mock that dependency.

Think of mocked dependencies as movies stunt doubles: you don't want your main stars to get hurt while performing action scenes. In the same way, you don't want your application to perform actual operations when running tests.

![Creating mocks is like [using stunt doubles](https://www.boredpanda.com/marvel-avengers-actors-stunt-doubles) for action scenes](./marvel-stunt-doubles.jpg "Marvel actors with their stunt doubles")

We will use **Moq** to test the method and check that the HTTP call is correctly adding the `objectName` variable in the query string.

## How to create mocks of IHttpClientFactory with Moq

Let's begin with the full code for the creation of mocked `IHttpClientFactory`s:

```cs
var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);

HttpResponseMessage result = new HttpResponseMessage();

handlerMock
    .Protected()
    .Setup<Task<HttpResponseMessage>>(
        "SendAsync",
        ItExpr.IsAny<HttpRequestMessage>(),
        ItExpr.IsAny<CancellationToken>()
    )
    .ReturnsAsync(result)
    .Verifiable();

var httpClient = new HttpClient(handlerMock.Object) { 
        BaseAddress = new Uri("https://www.code4it.dev/") 
    };

var mockHttpClientFactory = new Mock<IHttpClientFactory>();

mockHttpClientFactory.Setup(_ => _.CreateClient("ext_service")).Returns(httpClient);

service = new MyExternalService(mockHttpClientFactory.Object);
```

A lot of stuff is going on, right?

Let's break it down to fully understand what all those statements mean.

### Mocking HttpMessageHandler

The first instruction we meet is

```cs
var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
```

What does it mean?

`HttpMessageHandler` is the fundamental part of every HTTP request in .NET: it performs a **SendAsync** call to the specified endpoint with all the info defined in a `HttpRequestMessage` object passed as a parameter. 

Since we are interested in what happens to the `HttpMessageHandler`, we need to mock it and store the result in a variable.

Have you noticed that `MockBehavior.Strict`? This is an *optional* parameter that makes the mock throw an exception when it doesn't have a corresponding setup. To try it, remove that argument to the constructor and comment out the `handlerMock.Setup()` part: when you'll run the tests, you'll receive an error of type `Moq.MockException`.

Next step: defining the behavior of the mocked `HttpMessageHandler`

### Defining the behavior of HttpMessageHandler

Now we have to define what happens when we use the `handlerMock` object in any HTTP operation:

```cs
HttpResponseMessage result = new HttpResponseMessage();

handlerMock
    .Protected()
    .Setup<Task<HttpResponseMessage>>(
        "SendAsync",
        ItExpr.IsAny<HttpRequestMessage>(),
        ItExpr.IsAny<CancellationToken>()
    )
    .ReturnsAsync(result)
    .Verifiable();
```

The first thing we meet is that `Protected()`. Why?

To fully understand why we need it, and what is the meaning of the next operations, we need to have a look at the definition of `HttpMessageHandler`:

```cs
// Summary: A base type for HTTP message handlers.
public abstract class HttpMessageHandler : IDisposable
{
    /// Other stuff here...

    // Summary: Send an HTTP request as an asynchronous operation.
    protected internal abstract Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, 
        CancellationToken cancellationToken);
}
```

From this snippet, we can see that we have a method, `SendAsync`, which accepts an `HttpRequestMessage` object and a `CancellationToken`, and which is the one that deals with HTTP requests. **But this method is protected**. Therefore we need to use `Protected()` to access the protected methods of the `HttpMessageHandler` class, and we must set them up by using the method name and the parameters in the `Setup` method.


![With Protected() you can access protected members](./mr-turner-protected.jpg "")


Two details to notice, then:

* We specify the method to set up by using its name as a string: *"SendAsync"*
* To say that we don't care about the actual values of the parameters, we use `ItExpr` instead of `It` because we are dealing with the setup of a *protected* member.

If SendAsync was a public method, we would have done something like this:

```cs
handlerMock
    .Setup(_ => _.SendAsync(
        It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()) 
    );
```

But, since it is a protected method, we need to use the way I listed before.

Then, we define that the call to `SendAsync` returns an object of type `HttpResponseMessage`: here we don't care about the content of the response, so we can leave it in this way without further customizations.

### Creating HttpClient

Now that we have defined the behavior of the `HttpMessageHandler` object, we can pass it to the `HttpClient` constructor to create a new instance of `HttpClient` that acts as we need.

```cs
var httpClient = new HttpClient(handlerMock.Object) { 
        BaseAddress = new Uri("https://www.code4it.dev/") 
    };
```

Here I've set up the value of the `BaseAddress` property to a valid URI to avoid null references when performing the HTTP call. You can use even non-existing URLs: the important thing is that the URL must be well-formed.

### Configuring the IHttpClientFactory instance

We are finally ready to create the `IHttpClientFactory`!

```cs
var mockHttpClientFactory = new Mock<IHttpClientFactory>();

mockHttpClientFactory.Setup(_ => _.CreateClient("ext_service")).Returns(httpClient);

var service = new MyExternalService(mockHttpClientFactory.Object);
```

So, we create the Mock of `IHttpClientFactory` and define the instance of `HttpClient` that will be returned when calling `CreateClient("ext_service")`. Finally, we're passing the instance of `IHttpClientFactory` to the constructor of `MyExternalService`.

## How to verify the calls performed by IHttpClientFactory

Now, suppose that in our test we've performed the operation under test. 

```cs
// setup IHttpClientFactory
await service.DeleteObject("my-name");
```

How can we check if the `HttpClient` actually called an endpoint with "my-name" in the query string? As before, let's look at the whole code, and then let's analyze every part of it.

```cs
// verify that the query string contains "my-name"

handlerMock.Protected()
 .Verify(
    "SendAsync",
    Times.Exactly(1), // we expected a single external request
    ItExpr.Is<HttpRequestMessage>(req => 
        req.RequestUri.Query.Contains("my-name")// Query string contains my-name
    ),
    ItExpr.IsAny<CancellationToken>()
    );
```

### Accessing the protected instance

As we've already seen, the object that performs the HTTP operation is the  `HttpMessageHandler`, which here we've mocked and stored in the `handlerMock` variable.

Then we need to verify what happened when calling the `SendAsync` method, which is a protected method; thus we use `Protected` to access that member.

### Checking the query string

The core part of our assertion is this:

```cs
ItExpr.Is<HttpRequestMessage>(req => 
    req.RequestUri.Query.Contains("my-name")// Query string contains my-name
),
```

Again, we are accessing a `protected` member, so we need to use `ItExpr` instead of `It`.

The `Is<HttpRequestMessage>` method accepts a function `Func<HttpRequestMessage, bool>` that we can use to determine if a property of the `HttpRequestMessage` under test - in our case, we named that variable as `req` - matches the specified predicate. If so, the test passes.


## Refactoring the code

Imagine having to repeat that code for every test method in your class - what a mess!

So we can refactor it: first of all, we can move the `HttpMessageHandler`  mock to the `SetUp` method:

```cs
[SetUp]
public void Setup()
{
    this.handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);

    HttpResponseMessage result = new HttpResponseMessage();

    this.handlerMock
    .Protected()
    .Setup<Task<HttpResponseMessage>>(
        "SendAsync",
        ItExpr.IsAny<HttpRequestMessage>(),
        ItExpr.IsAny<CancellationToken>()
    )
    .Returns(Task.FromResult(result))
    .Verifiable()
    ;

    var httpClient = new HttpClient(handlerMock.Object) { 
        BaseAddress = new Uri("https://www.code4it.dev/") 
        };

    var mockHttpClientFactory = new Mock<IHttpClientFactory>();

    mockHttpClientFactory.Setup(_ => _.CreateClient("ext_service")).Returns(httpClient);

    this.service = new MyExternalService(mockHttpClientFactory.Object);
}
```

and keep a reference to `handlerMock` and `service` in some private members.

Then, we can move the *assertion* part to a different method, maybe to an extension method:


```cs
public static void Verify(this Mock<HttpMessageHandler> mock, Func<HttpRequestMessage, bool> match)
{
    mock.Protected().Verify(
        "SendAsync",
        Times.Exactly(1), // we expected a single external request
        ItExpr.Is<HttpRequestMessage>(req => match(req)
        ),
        ItExpr.IsAny<CancellationToken>()
    );
}
```

So that our test can be simplified to just a bunch of lines:

```cs
[Test]
public async Task Method_Should_ReturnSomething_When_Condition()
{
    //Arrange occurs in the SetUp phase

    //Act
    await service.DeleteObject("my-name");

    //Assert
    handlerMock.Verify(r => r.RequestUri.Query.Contains("my-name"));
}
```

## Further readings

🔗 [Why we need HttpClientFactory | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests "Use IHttpClientFactory to implement resilient HTTP requests | Microsoft Docs")

🔗 [HttpMessageHandler class | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpmessagehandler?view=net-5.0 "HttpMessageHandler class documentation")

🔗 [Mock objects with static, complex data by using Manifest resources | Code4IT](https://www.code4it.dev/blog/mock-dependency-with-manifest-resources "How to use Manifest resources to mock objects")

🔗 [Moq documentation | GitHub](https://github.com/moq/moq "Moq documentation on GitHub")

🔗 [How you can create extension methods in C# | Code4IT](https://www.code4it.dev/blog/csharp-extension-methods "How to create extension methods with C#")

## Wrapping up

In this article, we've seen how tricky it can be to test services that rely on `IHttpClientFactory` instances. Luckily, we can rely on tools like Moq to mock the dependencies and have full control over the behavior of those dependencies.

Mocking `IHttpClientFactory` is hard, I know. But here we've found a way to overcome those difficulties and make our tests easy to write and to understand.

There are lots of NuGet packages out there that help us mock that dependency: do you use any of them? What is your favourite, and why?

Happy coding!

🐧