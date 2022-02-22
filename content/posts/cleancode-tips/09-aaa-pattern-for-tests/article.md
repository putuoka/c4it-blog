---
title: "Clean Code Tip: AAA pattern for tests: why is it important?"
path: '/cleancodetips/aaa-pattern-for-tests'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "The most important trait of Tests? They must be correct. The second one? They must be readable. The AAA pattern helps you write better tests"
created: 2022-02-22
updated: 2022-02-22
---

Even though many developers underestimate this part, tests should be written even more clearly than production code.

This is true because, while production code is meant to be executed by the application, good tests allow you to document the behavior of the production code. So, the first consumers of the tests are the developers themselves.

So, how can we write better tests? A simple trick is following the *«Arrange, Act, Assert»* pattern.

## A working (but bad) example

As long as the tests pass, they are fine. 

Take this example:

```cs
[Test]
    public void TestDateRange_WithFutureDate()
    {
    var diff = (new DateTime(2021, 2, 8) - new DateTime(2021, 2, 3)).Days;
    Assert.AreEqual(5, diff);
}
```

Yes, the test passes, but when you need to read and understand it, everything becomes less clear.

So, it's better to explicitly separate the sections of the test. In the end, it's just a matter of readability.

## AAA: Arrange, Act, Assert

A better way to organize tests is by following the AAA pattern: **Arrange, Act, Assert**.

During the *Arrange* part, you define all the *preconditions* needed for your tests. You set up the input values, the mocked dependencies, and everything else needed to run the test.

The *Act* part is where you eventually run the production code. The easiest example is to run a method in the *System Under Test*.

Finally, the *Assert* part, where you check that everything worked as expected.

```cs
[Test]
public void TestDateRange_WithFutureDate()
{
// Arrange
var today = new DateTime(2021, 2, 3);
var otherDate = new DateTime(2021, 2, 8);

// Act
var diff = (otherDate.Date - today.Date).Days; 

// Assert
Assert.AreEqual(5, diff);
}
```

You don't need to specify in every method the three different parts, but personally, I find it more readable.

Think of tests as physics experiments: first, you set up the environment, then you run the test, and finally, you check if the result is the one you were expecting.

## Conclusion

This is a really simple way to improve your tests: keep every part separated from the others. It helps developers understand what is the meaning of each test, and allows for easier updates.

Happy coding

🐧
