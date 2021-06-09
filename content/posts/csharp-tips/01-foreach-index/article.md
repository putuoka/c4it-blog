---
title: "C# tip: how to get the index of an item in a foreach loop"
path: '/csharptips/how-to-get-item-index-in-foreach'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.jpg"
excerpt : "Do you need the index of the current item in a foreach loop with C#? Here you'll see two approaches."
created: 2021-06-08
updated: 2021-06-09
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

### Update 2021-06-09: the previous benchmark was wrong!!😐

The times listed in the previous table were misleading: I calculated those durations using a `StopWatch` and calling it in different methods.

But, when performing a more precise benchmark using [Benchmark.NET](https://benchmarkdotnet.org/articles/overview.html "Benchamark.NET website"), the results are totally different.

With _.NET Core 3.1.14_ I get the following results:


|   Method |        array |         Mean |       Error |
|--------- |------------- |-------------:|------------:|
| WithIndex | Int32[10000] | 269,386.4 ns | 6,168.76 ns |
| WithLinq | Int32[10000] | 396,421.3 ns | 7,778.64 ns |
| WithIndex |  Int32[1000] |  25,438.3 ns |   504.03 ns |
| WithLinq |  Int32[1000] |  39,981.3 ns | 1,578.48 ns |
| WithIndex |   Int32[100] |   2,440.8 ns |    48.34 ns |
| WithLinq |   Int32[100] |   3,687.7 ns |    73.60 ns |
| WithIndex |    Int32[10] |     185.6 ns |     3.52 ns |
| WithLinq |    Int32[10] |     369.5 ns |     9.51 ns |

While with _.NET 5_ I get these results:

|   Method |        array |          Mean |        Error |
|--------- |------------- |--------------:|-------------:|
| WithIndex | Int32[10000] | 134,431.02 ns | 2,181.244 ns |
| WithLinq | Int32[10000] | 273,691.68 ns | 5,334.833 ns |
| WithIndex |  Int32[1000] |  12,961.69 ns |   233.351 ns |
| WithLinq |  Int32[1000] |  26,023.63 ns |   495.341 ns |
| WithIndex |   Int32[100] |   1,088.25 ns |    21.485 ns |
| WithLinq |   Int32[100] |   2,299.12 ns |    21.901 ns |
| WithIndex |    Int32[10] |      48.01 ns |     0.748 ns |
| WithLinq |    Int32[10] |     228.66 ns |     4.531 ns |
 
As you can see, actually __using LINQ is slower than using a simple index__. While in .NET Core 3 the results were quite similar, with .NET 5 there was a huge improvement both cases, but now using a simple index is two times faster than using LINQ.

__SORRY FOR THAT MISLEADING INFO!__ Thank you, [Ben](https://github.com/bbuerger), for pointing it out in the comments section! 🙏 

Below you can see the code I used for this benchmark. I you want to get started with Benchmark.NET, look at the documentation or to my article [Enum.HasFlag performance with BenchmarkDotNet](../blog/hasflag-performance-benchmarkdotnet)

```cs
public class ForeachIndexBenchmark
  {
      public IEnumerable<int[]> Arrays()
      {
          yield return Enumerable.Range(0, 10).ToArray();
          yield return Enumerable.Range(0, 100).ToArray();
          yield return Enumerable.Range(0, 1000).ToArray();
          yield return Enumerable.Range(0, 10000).ToArray();
      }

      [Benchmark]
      [ArgumentsSource(nameof(Arrays))]
      public void WithIndex(int[] array)
      {
          int index = 0;
          var asString = "0";
          foreach (var friend in array)
          {
              asString = "" + index;
              index++;
          }
      }

      [Benchmark]
      [ArgumentsSource(nameof(Arrays))]
      public void WithLinq(int[] array)
      {
          var asString = "0";

          foreach (var friend in array.Select((item, index) => (item, index)))
          {
              asString = "" + friend.index;
          }
      }
  }

```

## Conclusions

We've discovered that there are many ways to use indexes tightly bound with items. If you look at performance, go for the simplest ways (`for` loop or `foreach` with simple index). If you want a more concise code, go for LINQ.

Anything else to add?

👉 Let's discuss about it [on Twitter](https://twitter.com/BelloneDavide/status/1333463303490658304) or on the comment section below!
