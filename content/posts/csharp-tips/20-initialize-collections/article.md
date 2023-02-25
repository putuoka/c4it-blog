---
title: "C# Tip: Initialize lists size to improve performance"
path: "/csharptips/initialize-lists-size"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "a description for 20-initialize-collections"
created: 4219-11-20
updated: 4219-11-20
---

Collections, like `HashSets`, have a predefined initial size.

Every time you add a new item to the collection, there are two scenarios:

1. the collection has free space, allocated but not yet populated, so adding an item is immediate;
2. the collection is already full: internally, .NET resizes the collection, so that the next time you add a new item, we fall back to the option #1.

Clearly, the second approach has an impact on the overall performace. Don't you trust me?

Here's a benchmark that you can run using BenchmarkDotNet:

```cs
[Params(2, 100, 1000, 10000, 100_000)]
public int Size;

[Benchmark]
public void SizeDefined()
{
    int itemsCount = Size;

    List<int> set = new List<int>(itemsCount);
    foreach (var i in Enumerable.Range(0, itemsCount))
    {
        set.Add(i);
    }
}
  
[Benchmark]
public void SizeNotDefined()
{
    int itemsCount = Size;

    List<int> set = new List<int>();
    foreach (var i in Enumerable.Range(0, itemsCount))
    {
        set.Add(i);
    }
}
```

Those two methods are almost identical: the only difference is that in one method we specify the initial size of the list: `new List<int>(itemsCount)`.

Have a look at the result of the benchmark (run with .NET 5)

|         Method |   Size |            Mean |         Error |        StdDev |          Median |     Gen0 |     Gen1 |     Gen2 | Allocated |
|--------------- |------- |----------------:|--------------:|--------------:|----------------:|---------:|---------:|---------:|----------:|
|    SizeDefined |      2 |        57.90 ns |      1.198 ns |      3.358 ns |        58.61 ns |   0.0248 |        - |        - |     104 B |
| SizeNotDefined |      2 |        66.27 ns |      1.375 ns |      3.267 ns |        67.40 ns |   0.0267 |        - |        - |     112 B |
|    SizeDefined |    100 |       837.51 ns |     16.516 ns |     31.821 ns |       841.27 ns |   0.1183 |        - |        - |     496 B |
| SizeNotDefined |    100 |       987.51 ns |     19.381 ns |     37.802 ns |       992.70 ns |   0.2918 |        - |        - |    1224 B |
|    SizeDefined |   1000 |    12,811.12 ns |  1,360.987 ns |  3,904.928 ns |    12,932.50 ns |   0.9766 |        - |        - |    4096 B |
| SizeNotDefined |   1000 |    10,902.35 ns |    158.718 ns |    313.294 ns |    10,857.76 ns |   2.0142 |        - |        - |    8464 B |
|    SizeDefined |  10000 |   104,066.47 ns |  2,048.305 ns |  2,871.437 ns |   104,584.79 ns |   9.5215 |   0.9766 |        - |   40096 B |
| SizeNotDefined |  10000 |   110,380.00 ns |  1,817.742 ns |  1,517.897 ns |   110,322.85 ns |  31.1279 |   5.1270 |        - |  131440 B |
|    SizeDefined | 100000 | 1,385,979.28 ns | 27,561.573 ns | 24,432.616 ns | 1,378,354.69 ns | 123.0469 | 123.0469 | 123.0469 |  400240 B |
| SizeNotDefined | 100000 | 1,945,355.46 ns | 25,382.400 ns | 21,195.454 ns | 1,945,489.16 ns | 285.1563 | 285.1563 | 285.1563 | 1049347 B |

And then, have a look at the same benchmark run with .NET 7:



Notice that, in general, they execute in a similar amount of time; for instance when running the same method with 100000 items, we have the same magnitude of time execution: 1,385,979.28 ns vs 1,945,355.46 ns (using .NET 5).

The huge difference is with the allocated space: 400,240 B vs 1,049,347 B. Almost 2.5 times better!



## Further readings

<links>

*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*

## Wrapping up

<Conclusion>

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛 

Happy coding!

🐧

## APPUNTI

[ ] Check grammar

[ ] Check titles

[ ] Alt text

[ ] Check bold/italics

[ ] Check frontmatter
