---
title: "C# tip: how to get the index of an item in a foreach loop"
path: '/csharptips/how-to-get-item-index-in-foreach'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.jpg"
excerpt : "Do you need the index of the current item in a foreach loop with C#? Here you'll see two approaches."
created: 2021-06-08
updated: 2021-06-08
---

Sometimes, when looping over a collection of elements in C#, you need not only the items itself, but also its position in the collection.

How to get the index of the current element in a `foreach` loop?

The easiest way is to store and update the index in a separate variable

```cs
List<string> myFriends = new List<string> {
    "Emma", "Rupert", "Daniel", "Maggie", "Alan"
};

int index = 0;
foreach (var friend in myFriends)
{
    Console.WriteLine($"Friend {index}: {friend}");
    index++;
}
```

This works fine, nothing to add.

But, if you want something a little more elegant and compact, you can use the `Select` method from LINQ:

```cs
List<string> myFriends = new List<string> {
  "Emma", "Rupert", "Daniel", "Maggie", "Alan"
};

foreach (var friend in myFriends.Select((name, index) => (name, index)))
{
  Console.WriteLine($"Friend {friend.index}: {friend.name}");
}
```

Why do I like this solution?

* it's more compact than the first one
* there is a tight bond between the current item in the loop and the index
* I find it cleaner and easier to read

Or... You can just replace it with a simple `for` loop!

## What about performance?

I've done a simple benchmark (see [here](https://twitter.com/BelloneDavide/status/1333516188262002688)), and it resulted that for lists with less than 1000 items, the first solution is faster, and for lists with 10000 items, using LINQ is way faster than using an external index.

| Size (#items) | With simple index (ms) | With LINQ (ms) |
|--|--|--|
|100 |96|128|
|1000|1225|1017|
|10000|5523|786|

This happens with .NET 5.

Anything else to add?

👉 Let's discuss about it [on Twitter](https://twitter.com/BelloneDavide/status/1333463303490658304) or on the comment section below!
