---
title: "C# Tip: Exception handling with WHEN clause"
path: '/csharptips/exception-handling-when-clause'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "Instead of using if-else or switch blocks to handle exception, you can do it gracefully using the 'when' keyword"
created: 2022-02-08
updated: 2022-02-08
---


From C# 6 on, you can use the `when` keyword to specify a condition before handling an exception.

Consider this - pretty useless, I have to admit - type of exception:

```cs
public class RandomException : System.Exception
{
    public int Value { get; }
    public RandomException()
    {
        Value = (new Random()).Next();
    }
}
```

This exception type contains a `Value` property which is populated with a random value when the exception is thrown.

What if you want to print a different message depending on whether the `Value` property is odd or even?

You can do it this way:

```cs
try
{
    throw new RandomException();
}
catch (RandomException re)  
{
    if(re.Value % 2 == 0)
        Console.WriteLine("Exception with even value");
    else 
        Console.WriteLine("Exception with odd value");
} 
```

But, well, you should keep your `catch` blocks as simple as possible. 

That's where the `when` keyword comes in handy.

## CSharp when clause

You can use it to create two distinct `catch` blocks, each one of them handles their case in the cleanest way possible.

```cs
try
{
    throw new RandomException();
}
catch (RandomException re) when (re.Value % 2 == 0)
{
    Console.WriteLine("Exception with even value");
}
catch (RandomException re)
{
    Console.WriteLine("Exception with odd value");
}
```

You must use the `when` keyword in conjunction with a condition, which can also reference the current instance of the exception being caught. In fact, the condition references the `Value` property of the `RandomException` instance.

## A real usage: HTTP response errors

Ok, that example with the random exception is a bit... useless?

Let's see a real example: handling different HTTP status codes in case of failing HTTP calls.

In the following snippet, I call an endpoint that returns a specified status code (506, in my case). 

```cs
try
{
    var endpoint = "https://mock.codes/506";
    var httpClient = new HttpClient();
    var response = await httpClient.GetAsync(endpoint);
    response.EnsureSuccessStatusCode();
}
catch (HttpRequestException ex) when (ex.StatusCode == (HttpStatusCode)506)
{
    Console.WriteLine("Handle 506: Variant also negotiates");
}
catch (HttpRequestException ex)
{
    Console.WriteLine("Handle another status code");
}
```

If the response is not a success, the `response.EnsureSuccessStatusCode()` throws an exception of type `HttpRequestException`. The thrown exception contains some info about the returned status code, which we can use to route the exception handling to the correct `catch` block using `when (ex.StatusCode == (HttpStatusCode)506)`.

Quite interesting, uh? 😉

To read more, you can head to [the official documentation](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/when), even though there's not so much. 

Happy coding!

🐧