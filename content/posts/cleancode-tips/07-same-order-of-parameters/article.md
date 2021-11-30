---
title: "Clean Code Tip: Keep the parameters in a consistent order"
path: '/cleancodetips/consistent-of-parameters'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Following a coherent standard, even for parameters order, helps developers when writing and, even more, reading code. How to do that?"
created: 2021-11-30
updated: 2021-11-30
---

If you have a set of related functions, use always a coherent order of parameters.

Take this _bad_ example:

```cs
IEnumerable<Section> GetSections(Context context);

void AddSectionToContext(Context context, Section newSection);

void AddSectionsToContext(IEnumerable<Section> newSections, Context context);
```

Notice the order of the parameters passed to `AddSectionToContext` and `AddSectionsToContext`: they are swapped!

Quite confusing, isn't it?

![Confusion intensifies](https://media.giphy.com/media/yZ2FSn86bf2co/giphy.gif "Confusion")

For sure, the code is harder to understand, since the order parameters is not what the reader expects it to be.

But, even worse, this issue may lead to hard-to-find bugs, especially when parameters are of the same type.

Think of this example:

```cs
IEnumerable<Item> GetPhotos(string type, string country);

IEnumerable<Item> GetVideos(string country, string type);
```

Well, what could possibly go wrong?!?

We have two ways to prevent possible issues:

1. use coherent order: for instance, `type` is always the first parameter
2. pass objects instead: you'll add a bit more code, but you'll prevent those issues

To read more about this code smell, check out [this article](https://maximilianocontieri.com/code-smell-87-inconsistent-parameters-sorting "Inconsistent Parameters Sorting | Maximiliano Contieri") by Maxi Contieri!


## Conclusion

To recap, always pay attention to the order of the parameters!

* keep them always in the same order
* use easy-to-understand order (remember the Principle of Least Surprise?)
* use objects instead, if necessary.

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1441462443364864006 "Original post on Twitter") or on the comment section below!

🐧
