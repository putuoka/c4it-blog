---
title: "Clean Code Tip: F.I.R.S.T. acronym for better unit tests"
path: '/cleancodetips/f-i-r-s-t-unit-tests'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Good unit tests have some properties in common: they are Fast, Independent, Repeatable, Self-validating, and Thorough. In a word: FIRST!"
created: 2022-07-26
updated: 2022-07-26
---

**FIRST** is an acronym that you should always remember if you want to write clean and extensible tests.

This acronym tells us that Unit Tests should be **Fast**, **Independent**, **Repeatable**, **Self-validating**, and **Thorough**.

## Fast

You should not create tests that require a long time for setup and start-up: ideally, you should be able to run the whole test suite in under a minute.

If your unit tests are taking too much time for running, there must be something wrong with it; there are many possibilities:

1. You're trying to access remote sources (such as real APIs, Databases, and so on): you should mock those dependencies to make tests faster and to avoid accessing real resources. If you need real data, consider creating integration/e2e tests instead.
2. Your *system under test* is too complex to build: too many dependencies? [DIT value](https://www.code4it.dev/blog/measure-maintainability-with-ndepend#depth-of-inheritance-tree-dit) too high?
3. The method under test does too many things. You should consider splitting it into separate, independent methods, and let the caller orchestrate the method invocations as necessary.

## Independent (or Isolated)

Test methods should be independent of one another.

Avoid doing something like this:

```cs
MyObject myObj = null;

[Fact]
void Test1()
{
    myObj = new MyObject();
    Assert.True(string.IsNullOrEmpty(myObj.MyProperty));

}

[Fact]
void Test2()
{

    myObj.MyProperty = "ciao";
    Assert.Equal("oaic", Reverse(myObj.MyProperty));

}
```

Here, to have Test2 working correctly, Test1 must run before it, otherwise `myObj` would be null. There's a dependency between Test1 and Test2.

How to avoid it? Create new instances for every test! May it be with some custom methods or in the StartUp phase. And **remember to reset the mocks as well.**

## Repeatable

Unit Tests should be repeatable. This means that **wherever and whenever** you run them, they should behave correctly.

So you should remove any dependency on the file system, current date, and so on.

Take this test as an example:

```cs
[Fact]
void TestDate_DoNotDoIt()
{

    DateTime d = DateTime.UtcNow;
    string dateAsString = d.ToString("yyyy-MM-dd");
    
    Assert.Equal("2022-07-19", dateAsString);
}
```

This test is strictly bound to the current date. So, if I'll run this test again in a month, it will fail.

We should instead remove that dependency and use dummy values or mock.

```cs
[Fact]
void TestDate_DoIt()
{

    DateTime d = new DateTime(2022,7,19);
    string dateAsString = d.ToString("yyyy-MM-dd");

    Assert.Equal("2022-07-19", dateAsString);
}
```

There are many ways to inject DateTime (and other similar dependencies) with .NET. I've listed some of them in this article: ["3 ways to inject DateTime and test it"](https://www.code4it.dev/blog/inject-and-test-datetime-dependency).

## Self-validating

Self-validating means that a test should perform operations and programmatically check for the result.

For instance, if you're testing that you've written something on a file, the test itself is in charge of checking that it worked correctly. **No manual operations should be done**.

Also, tests should provide explicit feedback: **a test either passes or fails;** no in-between.

## Thorough

Unit Tests should be thorough in that they must validate both the happy paths and the failing paths.

So you should test your functions with valid inputs and with invalid inputs.

You should also validate what happens if an exception is thrown while executing the path: are you handling errors correctly?

Have a look at this class, with a single, simple, method:

```cs
public class ItemsService
{

    readonly IItemsRepository _itemsRepo;

    public ItemsService(IItemsRepository itemsRepo)
    {
        _itemsRepo = itemsRepo;
    }
    
    public IEnumerable<Item> GetItemsByCategory(string category, int maxItems)
    {

        var allItems = _itemsRepo.GetItems();

        return allItems
                .Where(i => i.Category == category)
                .Take(maxItems);
    }
}
```

Which tests should you write for `GetItemsByCategory`?

I can think of these:

* what if `category` is null or empty?
* what if `maxItems` is less than 0?
* what if `allItems` is null?
* what if one of the items inside `allItems` is null? 
* what if `_itemsRepo.GetItems()` throws an exception?
* what if `_itemsRepo` is null? 

As you can see, even for a trivial method like this you should write a lot of tests, to ensure that you haven't missed anything.

## Conclusion

F.I.R.S.T. is a good way to way to remember the properties of a good unit test suite.

Always try to stick to it, and remember that [tests should be written even better than production code](https://www.code4it.dev/cleancodetips/tests-should-be-readable-too).

Happy coding!

🐧
