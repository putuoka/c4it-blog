---
title: "C# Tip: LINQ's Enumerable.Range to generate a sequence of consecutive numbers"
path: "/csharptips/enumerable-range"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "If you need a sequence of numbers, you can pick two ways: use a While loop, or use Enumerable.Range"
created: 2023-01-17
updated: 2023-01-17
---

When you need to generate a sequence of numbers in ascending order, you can just use a `while` loop with an enumerator, or you can use `Enumerable.Range`.

This method, which you can find in the `System.Linq` namespace, allows you to generate a sequence of numbers by passing two parameters: the _start_ number and the _total numbers_ to add.

```cs
Enumerable.Range(start:10, count:4) // [10, 11, 12, 13]
```

⚠ Notice that the second parameter is **not** the last number of the sequence. Rather, it's the length of the returned collection.

Clearly, it also works if the `start` parameter is negative:

```cs
Enumerable.Range(start:-6, count:3) // [-6, -5, -4]
```

But it will not work if the `count` parameter is negative: in fact, it will throw an `ArgumentOutOfRangeException`:

```cs
Enumerable.Range(start:1, count:-23) // Throws ArgumentOutOfRangeException
// with message "Specified argument was out of the range of valid values"(Parameter 'count')
```

⚠ Beware of overflows: it's not a circular array, so if you pass the `int.MaxValue` value while building the collection you will get another `ArgumentOutOfRangeException`.

```cs
Enumerable.Range(start:Int32.MaxValue, count:2) // Throws ArgumentOutOfRangeException
```

💡 Smart tip: you can use `Enumerable.Range` to generate collections of other types! Just use LINQ's `Select` method in conjunction with `Enumerable.Range`:

```cs
Enumerable.Range(start:0, count:5)
    .Select(_ => "hey!"); // ["hey!", "hey!", "hey!", "hey!", "hey!"]
```

**Notice that this pattern is not very efficient**: you first have to build a collection with N integers to then generate a collection of N strings. If you care about performance, go with a simple `while` loop - if you need a quick and dirty solution, this other approach works just fine.

## Further readings

There are lots of ways to achieve a similar result: another interesting one is by using the `yield return` statement:

🔗 [C# Tip: use yield return to return one item at a time | Code4IT](https://www.code4it.dev/csharptips/yield-return)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

In this C# tip, we learned how to generate collections of numbers using LINQ.

This is an incredibly useful LINQ method, but you have to remember that the second parameter does not indicate the last value of the collection, rather it's the length of the collection itself.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
