---
title: "C# Tip: use the @ prefix when a name is reserved"
path: '/csharptips/use-at-symbol-prefix'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "C#, as every other language, has several reserved keywords. Did you know that you can use them if you use the `@` prefix?"
created: 2022-10-25
updated: 2022-10-25
---

You already know it: using meaningful names for variables, methods, and classes allows you to write more readable and maintainable code.

It may happen that a good name for your business entity matches one of the reserved keywords in C#.

What to do, now?

There are tons of reserved keywords in C#. Some of these are

* int
* interface
* else
* null
* short
* event
* params

Some of these names may be a good fit for describing your domain objects or your variables. 

Talking about variables, have a look at this example:

```cs
var eventList = GetFootballEvents();

foreach(var event in eventList)
{
    // do something
}
```

That snippet will not work, since `event` is a reserved keyword.

You can solve this issue in 3 ways.

**You can use a synonym**, such as `action`:

```cs
var eventList = GetFootballEvents();

foreach(var action in eventList)
{
    // do something
}
```

But, you know, it doesn't fully match the original meaning.

**You can use the `my` prefix**, like this:

```cs
var eventList = GetFootballEvents();

foreach(var myEvent in eventList)
{
    // do something
}
```

But... does it make sense? Is it really *your* event?

The third way is by **using the `@` prefix**:


```cs
var eventList = GetFootballEvents();

foreach(var @event in eventList)
{
    // do something
}
```

That way, the code is still readable (even though, I admit, that @ is a bit weird to see around the code).

Of course, the same works for every keyword, like `@int`, `@class`, `@public`, and so on

## Further readings

If you are interested in a list of reserved keywords in C#, have a look at this article:

🔗 [C# Keywords (Reserved, Contextual) | Tutlane](https://www.tutlane.com/tutorial/csharp/csharp-keywords-reserved-contextual)

*This article first appeared on [Code4IT](https://www.code4it.dev/)*

## Wrapping up

It's a tiny tip, but it can help you write better code.

Happy coding!

🐧
