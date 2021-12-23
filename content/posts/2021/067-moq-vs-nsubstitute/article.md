---
title: "Moq vs NSubstitute: syntax cheat sheet"
path: '/blog/moq-vs-nsubstitute-syntax'
tags: ["Tests", "dotNET" , "MainArticle"]
featuredImage: "./cover.png"
excerpt : "Moq and NSubstitute are two of the most used library to mock dependencies on your Unit Tests. How do they differ? How can we move from one library to the other?"
created: 2021-10-26
updated: 2021-10-26
---

When writing Unit Tests, you usually want to mock dependencies. In this way, you can define the behavior of those dependencies, and have full control of the system under test.

For .NET applications, two of the most used mocking libraries are **Moq** and **NSubstitute**. They allow you to create and customize the behavior of the services injected into your classes. Even though they have similar functionalities, their syntax is slightly different. 

In this article, we will learn how the two libraries implement the most used functionalities; in this way, you can easily move from one to another if needed.

## A real-ish example

As usual, let's use a real example.

For this article, I've created a dummy class, `StringsWorker`, that does nothing but call another service, `IStringUtility`.

```cs
public class StringsWorker
{
    private readonly IStringUtility _stringUtility;

    public StringsWorker(IStringUtility stringUtility)
        => _stringUtility = stringUtility;

    public string[] TransformArray(string[] items)
        => _stringUtility.TransformAll(items);

    public string[] TransformSingleItems(string[] items)
        => items.Select(i => _stringUtility.Transform(i)).ToArray();

    public string TransformString(string originalString)
        => _stringUtility.Transform(originalString);
}
```

To test the `StringsWorker` class, we will mock its only dependency, `IStringUtility`. This means that we won't use a concrete class that implements `IStringUtility`, but rather we will use Moq and NSubstitute to mock it, defining its behavior and simulating real method calls.

Of course, to use the two libraries, you have to install them in each tests project.

## How to define mocked dependencies

The first thing to do is to instantiate a new mock.

**With Moq**, you create a new instance of `Mock<IStringUtility>`, and then inject its `Object` property into the `StringsWorker` constructor:

```cs
private Mock<IStringUtility> moqMock;
private StringsWorker sut;

public MoqTests()
{
    moqMock = new Mock<IStringUtility>();
    sut = new StringsWorker(moqMock.Object);
}
```

With **NSubstitute**, instead, you declare it with `Substitute.For<IStringUtility>()` - which returns an `IStringUtility`, not wrapped in any class - and then you inject it into the `StringsWorker` constructor:

```cs
private IStringUtility nSubsMock;
private StringsWorker sut;

public NSubstituteTests()
{
    nSubsMock = Substitute.For<IStringUtility>();
    sut = new StringsWorker(nSubsMock);
}
```

Now we can customize `moqMock` and `nSubsMock` to add behaviors and verify the calls to those dependencies.

## Define method result for a specific input value: the Return() method

Say that we want to customize our dependency so that, every time we pass "ciao" as a parameter to the `Transform` method, it returns "hello".

**With Moq** we use a combination of `Setup` and `Returns`.

```cs
moqMock.Setup(_ => _.Transform("ciao")).Returns("hello");
```

**With NSubstitute** we don't use Setup, but we directly call `Returns`.

```cs
nSubsMock.Transform("ciao").Returns("hello");
```

## Define method result regardless of the input value: It.IsAny() vs Arg.Any()

Now we don't care about the actual value passed to the `Transform` method: we want that, regardless of its value, the method always returns "hello".

**With Moq**, we use `It.IsAny<T>()` and specify the type of `T`:

```cs
moqMock.Setup(_ => _.Transform(It.IsAny<string>())).Returns("hello");
```

**With NSubstitute**, we use `Arg.Any<T>()`:

```cs
nSubsMock.Transform(Arg.Any<string>()).Returns("hello");
```

## Define method result based on a filter on the input: It.Is() vs Arg.Is()

Say that we want to return a specific result only when a condition on the input parameter is met.

For example, every time we pass a string that starts with "IT" to the `Transform` method, it must return "ciao".

**With Moq**, we use `It.Is<T>(func)` and we pass an expression as an input.

```cs
moqMock.Setup(_ => _.Transform(It.Is<string>(s => s.StartsWith("IT")))).Returns("ciao");
```

Similarly, **with NSubstitute**, we use `Arg.Is<T>(func)`.

```cs
nSubsMock.Transform(Arg.Is<string>(s => s.StartsWith("IT"))).Returns("ciao");
```

Small trivia: for NSubstitute, the filter is of type `Expression<Predicate<T>>`, while for Moq it is of type `Expression<Func<TValue, bool>>`: don't worry, you can write them in the same way!

## Throwing exceptions

Since you should test not only happy paths, but even those where an error occurs, you should write tests in which the injected service throws an exception, and verify that that exception is handled correctly.

With both libraries, you can throw a generic exception by specifying its type:

```cs
//Moq
moqMock.Setup(_ => _.TransformAll(null)).Throws<ArgumentException>();

//NSubstitute
nSubsMock.TransformAll(null).Throws<ArgumentException>();
```

You can also throw a specific exception instance - maybe because you want to add an error message:

```cs
var myException = new ArgumentException("My message");

//Moq
moqMock.Setup(_ => _.TransformAll(null)).Throws(myException);

//NSubstitute
nSubsMock.TransformAll(null).Throws(myException);
```

If you don't want to handle that exception, but you want to propagate it up, you can verify it in this way:

```cs
Assert.Throws<ArgumentException>(() => sut.TransformArray(null));
```

## Verify received calls: Verify() vs Received()

Sometimes, to understand if the code follows the execution paths as expected, you might want to verify that a method has been called with some parameters.

To verify it, you can use the `Verify` method **on Moq**.

```cs
moqMock.Verify(_ => _.Transform("hello"));
```

Or, if you use **NSubstitute**, you can use the `Received` method.

```cs
nSubsMock.Received().Transform("hello");

```

Similar as we've seen before, you can use `It.IsAny`, `It.Is`, `Arg.Any` and `Arg.Is` to verify some properties of the parameters passed as input.


## Verify the exact count of received calls

Other times, you might want to verify that a method has been called *exactly N times*.

**With Moq**, you can add a parameter to the `Verify` method: 

```cs
sut.TransformSingleItems(new string[] { "a", "b", "c" });

moqMock.Verify(_ => _.Transform(It.IsAny<string>()), Times.Exactly(3));
```

Note that you can specify different values for that parameter, like `Time.Exactly`, `Times.Never`, `Times.Once`, `Times.AtLeast`, and so on.

With **NSubstitute**, on the contrary, you can only specify a defined value, added as a parameter to the `Received` method.

```cs
sut.TransformSingleItems(new string[] { "a", "b", "c" });

nSubsMock.Received(3).Transform(Arg.Any<string>());
```

## Reset received calls

As you remember, the mocked dependencies have been instantiated within the constructor, so every test method uses the same instance. This may cause some troubles, especially when checking how many calls the dependencies have received (because the count of received calls accumulates for every test method run before). Therefore, we need to reset the count of the received calls.

In NUnit, you can define a method that will run *before* any test method - but only if decorated with the `SetUp` attribute:

```cs
[SetUp]
public void Setup()
{
  // reset count
}
```

Here we can reset the number of the recorded method invocations on the dependencies and make sure that our test methods use always _clean_ instances.

**With Moq**, you can use `Invocations.Clear()`:

```cs
[SetUp]
public void Setup()
{
    moqMock.Invocations.Clear();
}
```

While, **with NSubstitute**, you can use `ClearReceivedCalls()`:

```cs
[SetUp]
public void Setup()
{
    nSubsMock.ClearReceivedCalls();
}
```
 

## Further reading

As always, the best way to learn what a library can do is head to its documentation. So, here you can find the links to Moq and NSubstitute docs.

🔗 [Moq documentation | GitHub](https://github.com/Moq/moq4/wiki/Quickstart "Moq documentation | GitHub")

🔗 [NSubstitute documentation | NSubstitute](https://nsubstitute.github.io "NSubstitute documentation | NSubstitute")
 
If you already use Moq but you are having some troubles testing and configuring `IHttpClientFactory` instances, I got you covered:

🔗 [How to test HttpClientFactory with Moq | Code4IT](https://www.code4it.dev/blog/testing-httpclientfactory-moq "How to test HttpClientFactory with Moq | Code4IT")

Finally, if you want to see the complete code of this article, you can find it on GitHub; I've written the exact same tests with both libraries so that you can compare them more easily.

🔗 [GitHub repository for the code used in this article | GitHub](https://github.com/code4it-dev/NSubstituteVsMoq "GitHub repository for the code used in this article | GitHub")


## Conclusion

In this article, we've seen how Moq and NSubstitute allow us to perform some basic operations when writing unit tests with C#. They are similar, but each one of them has a specific set of functionalities that are missing on the other library - or, at least, that I don't know if they exist in both.

Which library do you use, Moq or NSubstitute? Or maybe, another one?

Happy coding!
🐧
