---
title: "MSTest StringAssert class - an overview"
path: "/blog/mstests-stringassert-overview"
tags: ["CSharp", "Tests", "MainArticle"]
featuredImage: "./cover.jpg"
excerpt: "The StringAssert class is a hidden feature of the MSStest framework. Not so many methods, but they can help you with basic tests with strings."
created: 2019-03-20
updated: 2019-03-20
---

This is the second part of our journey through the Unit Test classes provided with VisualStudio. We [already had a look](./mstests-assert-overview "My previous article about the Assert class") at the `Assert` class, where had a glimpse of its methods. Now we'll have a look at the **StringAssert** class, that, as you can imagine, provides some useful methods for string evaluation.

## The StringAssert class

[This class](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting.stringassert "StringAssert documentation") belongs to `Microsoft.VisualStudio.TestTools.UnitTesting` namespace. It's a small class with few methods: maybe that's the reason it is not preferred over the Assert class when testing a string.

### StringAssert.Contains

This method checks if the actual string contains the expected string.

```cs
[TestMethod()]
public void TestContains()
{
    string full = "Duck Avenger";
    string substring = "Aveng";
    StringAssert.Contains(full, substring); //OK
    substring = "AVEN";
    StringAssert.EndsWith(full, substring); //KO
}
```

### StringAssert.StartsWith

Obviously it checks if the first parameters starts with a substring - that is the second parameter.

```cs
[TestMethod()]
public void TestStartsWith()
{
    string full = "Donald Duck";
    string substring = "Don";
    StringAssert.StartsWith(full, substring); //OK
    substring = "don";
    StringAssert.StartsWith(full, substring); //KO
}
```

As you can see, the comparison is case sensitive, so the second check will fail.

### StringAssert.EndsWith

Well, you can imagine... Also, the comparison is case sensitive.

```cs
[TestMethod()]
public void TestEndsWith()
{
    string full = "Uncle Scrooge";
    string substring = "ooge";
    StringAssert.EndsWith(full, substring); //OK
    substring = "OOGE";
    StringAssert.EndsWith(full, substring); //KO
}
```

### StringAssert.Matches

`StringAssert.Matches` and `StringAssert.DoesNotMatch` are a bit more complicated, since they involve regular expressions.

```cs
[TestMethod()]
public void TestRegex()
{
    Regex regex = new Regex(@"[a-z]+");
    StringAssert.Matches("foo", regex);
    StringAssert.DoesNotMatch("123", regex);
}
```

## Wrapping Up

In my opinion, by now only the Matches method is useful. The others are missing important capabilities, like a parameter for specifying if the comparison is case sensitive and the possibility to specify the _CultureInfo_.

Another functionality that is missing is the possibility to test the negative counterpart of those methods (except for Matches and DoesNotMatch). I mean, I cannot test if a string _does not_ start with a substring.

In the next article of this series, I'm going to talk about the _CollectionAssert_ class. That is about... _suspense..._
