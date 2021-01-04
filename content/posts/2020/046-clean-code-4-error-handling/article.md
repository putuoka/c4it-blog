---
title: "Clean code tips - Error handling"
path: "/blog/clean-code-error-handling"
tags: ["Clean Code"]
featuredImage: "./cover.jpg"
excerpt:  "The way you handle errors on your code can have a huge impact on the maintainability of your projects. Don't underestimate the power of clean error handling."
created: 2020-12-15
updated: 2020-12-15
---

We all know that nothing goes perfectly smoothly: network errors, invalid formats, null references... We can have a long, long list of what can go wrong in our applications. So, it is important to handle errors with the same care we have for all the rest of our code.

This is the fourth part of this series about clean code, which is a recap of the things I learned from Uncle Bob's "Clean Code". If you want to read more, here's the other articles I wrote:

1. [names and function arguments](./clean-code-names-and-functions "Clean code tips - names and functions")
2. [comments and formatting](./clean-code-comments-and-formatting "Clean code tips - comments and formatting")
3. [abstraction and objects](./clean-code-abstraction-and-objects "Clean code tips - Abstraction and objects")
4. error handling

## Status codes or exceptions?

In Uncle Bob's opinion, __we should always prefer exceptions over status codes when returning values__.

Generally speaking, I agree. But let's discuss a little about the differences.

First of all, below you can see a method that, when downloading a string, returns both the status code and the real content of the operation.

```cs
void Main()
{
    (HttpStatus status, string content) = DownloadContent("https://code4it.dev");
    if (status == HttpStatus.Ok)
    {
        // do something with the content
    }
    else if (status == HttpStatus.NotFound)
    {
        // do something else
    }
    // and so on
}

public (HttpStatus, string) DownloadContent(string url)
{
    // do something
}

// Define other methods and classes here

public enum HttpStatus
{
    Ok,
    NotFound,
    Unauthorized,
    GenericError
}
```

When you use status codes, you have to _manually check the result_ of the operation with a `switch` or an `if-else`. So, if the caller method forgets to check whether the operation was successful, you might incur in unexpected execution paths.

Now, let's transform the code and use exceptions instead of status codes:

```cs
void Main()
{
    try
    {
        string content = DownloadContent("https://code4it.dev");
    }
    catch (NotFoundException nfe) {/*do something*/}
    catch (UnauthorizedException ue) {/*do something*/}
    catch (Exception e) {/*do something else*/}
    }
}

public string DownloadContent(string url)
{
    // do something
    return "something";
    // OR throw NotFoundException
    // OR throw UnauthorizedException
    // OR do something else
}
```

As you can see, the code is clearly easier to read: the "main" execution is defined within the `try` block.

__What are the pros and cons of using exceptions over status codes__?

* __PRO__: the "happy path" is easier to read
* __PRO__: every time you forget to manage all the other cases, you will see a meaningful exception instead of ending up with a messy execution without a clue of what went wrong
* __PRO__: the execution and the error handling parts are strongly separated, so you can easily separate the two concerns
* __CON__: you are defining the execution path using exceptions instead of status (which is bad...)
* __CON__: every time you add a `try-catch` block, you are adding overhead on the code execution.

The reverse is obviously valid for status codes.

So, what to do? Well, __exceptions should be used in _exceptional_ cases__, so if you are expecting a range of possible status that can be all managed in a reasonable way, go for enums. If you are expecting an "unexpected" path that you cannot manage directly, go for exceptions!

__If you really need to use status code, use enums instead of strings or plain numbers.__

## TDD can help you handling errors

Don't forget that error handling must be thoroughly tested. One of the best ways is to write your tests first: __this will help you figuring out what kind of exceptions, if any, your method should throw, and which ones it should manage__.

Once you have written some tests for error handling, add a `try-catch` block and start thinking to the actual business logic: you now can be sure that you're covering errors with your tests.

## Wrap external dependencies to manage their exceptions

Say that you use a third-party library as core part of your application.

```cs
public class ExternalDependency
{
    public string DownloadValue(string resourcePath){
        // do something
    }
}
```

and that this method throws some _custom_ exceptions, like `ResourceNotFoundException`, `InvalidCredentialsExceptions` and so on.

In the client code you might want to handle errors coming from that external dependency in a specific manner, while the general error handling has a different behavior.

```cs
void Main()
{
    ExternalDependency service = CreateExternalService();

    try
    {
        var value = GetValueToBeDowloaded();
        service.DownloadValue(value);
    }
    catch (ResourceNotFoundException rnfex)
    {
        logger.Log("Unable to get resource");
        ManageDownloadFailure();
    }
    catch (InvalidCredentialsExceptions icex)
    {
        logger.Log("Unable to get resource");
        ManageDownloadFailure();
    }
    catch (Exception ex)
    {
        logger.Log("Unable to complete the operation");
        DoSomethingElse();
    }
}
```

This seems reasonable, but what does it imply? First of all, __we are repeating the same error handling__ in multiple `catch` blocks. Here I have only 2 custom exceptions, but think of complex libraries that can throw tens of exceptions. Also, __what if the library adds a new Exception?__ In this case, you should update every client that calls the `DownloadValue` method.

Also, the caller is not actually interested on the type of exception thrown by the external library; it cares only of the status of the operations, not the reason of a potential failure.

So, in this case, the best thing to do is to __wrap this external class into a custom one__. In this way we can define our Exception types, enrich them with all the properties we need, and catch only them; all of this while being sure that even if the external library changes, our code won't be affected.

So, here's an example of how we can wrap the `ExternalDependency` class:

```cs
public class MyDownloader
{
    public string DownloadValue(string resourcePath)
    {
        var service = new ExternalDependency();

        try
        {
            return service.DownloadValue(resourcePath);
        }
        catch (Exception ex)
        {
            throw new ResourceFileDownloadException(ex, resourcePath);
        }
    }
}
```

Now that all our clients use the `MyDownloader` class, the only type of exception to manage is `ResourceFileDownloadException`. Notice how I enriched this exception with the name of the resource that the service wasn't able to download.

Another good reason to wrap external libraries? What if they become obsolete, or you just need to use something else because it fits better with the use case you need?

## Define exception types thinking of the clients

Why haven't I exposed multiple exceptions, but I chose to throw only a `ResourceFileDownloadException`? Because you should define your exceptions thinking of how they can be helpful to their caller classes.

I could have thrown other custom exceptions that mimic the ones exposed by the library, but they would have not brought value to the overall system. In fact, the caller does not care that _MyDownloader failed because the resource does not exist_, but it cares only that _an error occurred when downloading a resource_. It doesn't even care that that exception was thrown by `MyDownloader`!

So, when planning your exceptions, think of _how they can be used by their clients_ rather than where they are thrown.

## Fighting the devil: null reference

Everyone fights with null values. If you refence a null value, you will break the whole program with some ugly messages, like _cannot read property of ..._ in JavaScript, or with a `NullReferenceException` in C#.

So, the best thing to do to avoid this kind of error is, obviously, to reduce the amount of possible null values in our code.

We can deal with it in two ways: avoid returning null from a function and avoid passing null values to functions!

### How to avoid returning null values

Unless you don't have specific reasons to return `null`, so when that value is acceptable in your domain, try not to return `null`.

For _string values_, you can simply return empty strings, __if it is considered an acceptable value__.

For _lists of values_, you should return an empty list.

```cs
IEnumerable<char> GetOddChars(string value)
{
    if (value.Length > 0)
    {
        // return something
    }
    else
    {
        return Enumerable.Empty<char>();
        // OR return new List<char>();
    }
}
```

In this way you can write something like this:

```cs
    var chars = GetOddChars("hello!");
    Console.WriteLine(chars.Count());

    foreach (char c in chars)
    {
        // Do Something
    }
```

Without a single check on null values.

What about objects? There are many approaches that you can take, like using the [Null Object pattern](https://www.tutorialspoint.com/design_pattern/null_object_pattern.htm "Null Object Pattern design pattern")
which allows you to create an instance of an abstract class which does nothing at all, so that your code won't care if the operations it does are performed on an actual object or on a Null Object.

### How to avoid passing null values to functions

Well, since we've already avoided nulls from return values, we may expect that we will never pass them to our functions. Unfortunately, that's not true: what about you were using external libraries to get some values and then use them on your functions?

Of course, it's better to check for null values _before_ calling the function, and not inside the function itself; in this way, the meaning of the function is clearer and the code is more concise.

```cs
public float CalculatePension(Person person, Contract contract, List<Benefit> benefits)
{
    if (person != null)
    {
        // do something with the person instance
        if(contract != null && benefits != null)
        {
            // do something with the contract instance
            if(benefits != null)
            {
                // do something
            }
        }
    }
    // what else?
}
```

... and now see what happens when you repeat those checks for every method you write. 

As we say, __prevention is better than the cure!__

## Progressive refinements

It's time to apply those tips in a real(ish) scenario. Let's write a method that read data from the file system, parses its content, and sends it to a remote endpoint.

### Initial implementation

First step: read a stream from file system:

```cs
(bool, Stream) ReadDataFromFile(string filePath)
{
    if (string.IsNullOrWhiteSpace(filePath))
    {
        Stream stream = ReadFromFileSystem(filePath);

        if (stream != null && stream.Length > 0) 
            return (true, stream);
    }

    return (false, null);
}
```

This method returns a tuple with info about the existence of the file and the stream itself.

Next, we need to convert that stream into plain text:

```cs
string ConvertStreamIntoString(Stream fileStream)
{
    return fileStream.ConvertToString();
}
```

Nothing fancy. Ah, `ConvertToString` does not really exist in the .NET world, but let's fake it!

Third step, we need to send the string to the remote endpoint.

```cs
OperationResult SendStringToApi(string fileContent)
{
    using (var httpClient = new HttpClient())
    {
        httpClient.BaseAddress = new Uri("http://some-address");

        HttpRequestMessage message = new HttpRequestMessage();
        message.Method = HttpMethod.Post;
        message.Content = ConvertToContent(fileContent);

        var httpResult = httpClient.SendAsync(message).Result;

        if (httpResult.IsSuccessStatusCode)
            return OperationResult.Ok;
        else if (httpResult.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            return OperationResult.Unauthorized;
        else return OperationResult.GenericError;
    }
}
```

We use the native `HttpClient` .NET class to send our string to the remote endpoint, and then we fetch the result and map it to an enum, `OperationResult`.

_Hey, have you noticed it? I used an asynchronous method in a synchronous one using `httpClient.SendAsync(message).Result`. But it's the wrong way to do it! If you want to know more, head to my article [First steps with asynchronous programming in C#](./asynchronous-programming-in-csharp "First steps with asynchronous programming in C# - Code4IT")_

Finally, the main method.

```cs
void Main()
{
    (bool fileExists, Stream fileStream) = ReadDataFromFile("C:\some-path");
    if (fileExists)
    {
        string fileContent = ConvertStreamIntoString(fileStream);
        if (!string.IsNullOrWhiteSpace(fileContent))
        {
            var operationResult = SendStringToApi(fileContent);
            if (operationResult == OperationResult.Ok)
            {
                Console.WriteLine("Yeah!");
            }
            else
            {
                Console.WriteLine("Not able to complete the operation");
            }
        }
        else
        {
            Console.WriteLine("The file was empty");
        }
    }
    else
    {
        Console.WriteLine("File does not exist");
    }
}
```

Quite hard to understand, right? __All those if-else do not add value to our code__. We don't manage errors in an alternate way, we just write on console that something has gone wrong. So, we can improve it by removing all those `else` blocks.

```cs
void Main()
{
    (bool fileExists, Stream fileStream) = ReadDataFromFile("C:\some-path");
    if (fileExists)
    {
        string fileContent = ConvertStreamIntoString(fileStream);
        if (!string.IsNullOrWhiteSpace(fileContent))
        {
            var operationResult = SendStringToApi(fileContent);
            if (operationResult == OperationResult.Ok)
            {
                Console.WriteLine("Yeah!");
            }
        }
    }
}
```

A bit better! It definitely looks like the code I used to write. But we can do more. 💪

### A better way

Let's improve each step.

Take the `ReadDataFromFile` method. The boolean value returned in the tuple is a flag and should be removed. How? Time to create a custom exception.

How to call this exception? `DataReadException`? `FileSystemException`? Since we should think of the needs of the caller, not the method itself, a good name could be `DataTransferException`.

```cs
Stream ReadDataFromFile(string filePath)
{
    try
    {
        Stream stream = ReadFromFileSystem(filePath);
        if (stream != null && stream.Length > 0) return stream;
        else throw new DataTransferException($"file {filePath} not found or invalid");
    }
    catch (DataTransferException ex) { throw; }
    catch (Exception ex)
    {
        new DataTransferException($"Unable to get data from {filePath}", ex);
    }
}
```

We can notice 3 main things:

1. we don't check anymore if the `filePath` value is null, because we will always pass a valid string (to avoid null values as input parameters);
2. if the stream is invalid, we throw a new `DataTransferException` exception with all the info we need;
3. since we don't know if the native classes to interact with file system will change and throw different exceptions, we wrap every error into our custom `DataTransferException`.

Here I decided to remove the boolean value because we don't have an alternate way to move on with the operations. If we had a fallback way to retrieve the stream (for example from another source) we could have kept our tuple and perform the necessary checks. 

The `ConvertStreamIntoString` does not so much, it just calls another method. If we have control over that `ConvertToString` we can handle it like we did with `ReadDataFromFile`. We can observe that we don't need to check if the input stream is valid because we have already done in the `ReadDataFromFile` method.

Time to update our `SendStringToApi`!

Since we're using an external class to perform HTTP requests (the native `HttpClient`), we'll wrap our code into a try-catch-block and throw only exceptions of type `DataTransferException`; and since we don't actually need a result, we can return `void` instead of that `OperationResult` enum.

```cs
void SendStringToApi(string fileContent)
{
    HttpClient httpClient = null;
    try
    {
        httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri("http://some=address");

        HttpRequestMessage message = new HttpRequestMessage();
        message.Method = HttpMethod.Post;
        message.Content = ConvertToContent(fileContent);
        var httpResult = httpClient.SendAsync(message).Result;

        httpResult.EnsureSuccessStatusCode();
    }
    catch (Exception ex)
    {
        throw new DataTransferException("Unable to send data to the endpoint", ex);
    }
    finally
    {
        httpClient.Dispose();
    }
}
```

Now we can finally update our `Main` method and remove all that clutter that did not bring any value to our code:

```cs
void Main()
{
    try
    {
        Stream fileStream = ReadDataFromFile("C:\some-path");
        string fileContent = ConvertStreamIntoString(fileStream);
        SendStringToApi(fileContent);
        Console.WriteLine("Yeah!");
    }
    catch (DataTransferException dtex)
    {
        Console.WriteLine($"Unable to complete the transfer: {dtex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
    }
}
```

Finally, someone who reads our code has a clear idea of what's going on, and how information pass through one step or another.

Much better, isn't it?

## Wrapping up

We've seen that writing good error handling is not as easy as it seems. You must consider a lot of things, like

* choosing if using only exceptions or rely also on status codes
* define which exceptions a method should throw and which ones it should catch (you can use TDD to plan for them easily)

Also, remember that

* external libraries may change or may be cumbersome, so you'd better wrap external classes into custom ones
* exceptions should be client-oriented, to help callers understand what's going on without unnecessary details

Happy coding!