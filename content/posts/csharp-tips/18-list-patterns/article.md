---
title: "C# Tip: List Pattern to match an collection against a sequence of patterns"
path: "/csharptips/list-pattern"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "By using list patterns on an array or a list you can check whether a it contains the values you expect in a specific position."
created: 2023-02-14
updated: 2023-02-14
---

With C# 11 we have an interesting new feature: **list patterns**.

You can, in fact, use the `is` operator to check if an array has the exact form that you expect.

Take this method as an example.

## Introducing List Patterns

```cs
string YeahOrError(int[] s)
{
    if (s is [1, 2, 3]) return "YEAH";
    return "error!";
}
```

As you can imagine, the previous method returns YEAH if the input array is exactly `[1, 2, 3]`. You can, in fact, try it by running some tests:

```cs
[Test]
public void PatternMatchingWorks()
{
    Assert.That(YeahOrError(new int[] { 1, 2, 3 }), Is.EqualTo("YEAH"));
    Assert.That(YeahOrError(new int[] { 1, 2, 3, 4 }), Is.EqualTo("error!"));
    Assert.That(YeahOrError(new int[] { 2, 3, 1}), Is.EqualTo("error!"));
}
```

As you can see, if the order is different, the check does not pass.

## List Patterns with Discard

We can also use **discard** values to check whether a list contains a specific item in a specified position, ignoring all the other values:

```cs
string YeahOrErrorWithDiscard(int[] s)
{
    if (s is [_, 2, _]) return "YEAH";
    return "error!";
}
```

So, to be valid, the array must have exactly 3 elements, and the second one must be a "2".

```cs
[Test]
public void PatternMatchingWorksWithDiscard()
{
    Assert.That(YeahOrErrorWithDiscard(new int[] { 1, 2, 3 }), Is.EqualTo("YEAH"));
    Assert.That(YeahOrErrorWithDiscard(new int[] { 9, 2, 6 }), Is.EqualTo("YEAH"));
    Assert.That(YeahOrErrorWithDiscard(new int[] { 1, 6, 2, 3 }), Is.EqualTo("error!"));
    Assert.That(YeahOrErrorWithDiscard(new int[] { 6, 3, 8, 4 }), Is.EqualTo("error!"));
}
```

## List Patterns with variable assignment


You can also **assign one or more of such values to a variable**, and discard all the others:

```cs
string SelfOrMessageWithVar(int[] s)
{
    if (s is [_, 2, int third]) return "YEAH_" + third;
    return "error!";
}
```

The previous condition, `s is [_, 2, int third]`, returns `true` only if the array has 3 elements, and the second one is "2". Then, it stores the third element in a new variable, `int third`, and uses it to build the returned string.

```cs
[Test]
public void can_use_list_patterns_with_var()
{
    Assert.That(SelfOrMessageWithVar(new int[] { 1, 2, 3 }), Is.EqualTo("YEAH_3"));
    Assert.That(SelfOrMessageWithVar(new int[] { 1, 6, 2, 3 }), Is.EqualTo("error!"));
    Assert.That(SelfOrMessageWithVar(new int[] { 6, 3, 8, 4 }), Is.EqualTo("error!"));
}
```

## List Patterns with item constraints


Finally, you can also specify further constraints on each value in the condition, using **operators such as `or`, `>`, `>=`**, and so on.

```cs
string SelfOrMessageWithCondition(int[] s)
{
    if (s is [0 or 1, > 2, int third]) return "YEAH_" + third;
    return "error!";
}
```

You can easily guess the meaning of the previous method. You can double-check the actual result by looking at the following tests:

```cs
[Test]
[DotNet7]
public void can_use_list_patterns_with_condition()
{
    Assert.That(SelfOrMessageWithCondition(new int[] { 0, 4, 3 }), Is.EqualTo("YEAH_3"));
    Assert.That(SelfOrMessageWithCondition(new int[] { 6, 4, 3 }), Is.EqualTo("error!"));
    Assert.That(SelfOrMessageWithCondition(new int[] { 1, 2, 3 }), Is.EqualTo("error!"));
    Assert.That(SelfOrMessageWithCondition(new int[] { 1, 6, 2, 3 }), Is.EqualTo("error!"));
    Assert.That(SelfOrMessageWithCondition(new int[] { 6, 3, 8, 4 }), Is.EqualTo("error!"));
}
```

To read more about List patterns, just head to the [official documentation 🔗](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/patterns#list-patterns).

*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*

## Wrapping up

This is a new feature in C#. Have you ever used it in your production code?

Or is it "just" a nice functionality that nobody uses? Drop a message below if you have a real use if it 📩

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛 

Happy coding!

🐧
