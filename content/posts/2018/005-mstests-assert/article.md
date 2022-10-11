---
title: "MSTest Assert class - an overview"
path: "/blog/mstests-assert-overview"
tags: ["CSharp", "Tests", "MainArticle"]
featuredImage: "./cover.jpg"
excerpt: The Assert class is the first step you'll probably take into unit testing. But do you know that there's more than the IsTrue() method?
created: 2018-12-05
updated: 2018-12-05
---

You know, **Unit Tests are our friends**. Usually skipped, often misused, but they are still with us.  
With or without mocks, they can help us while creating an application, ensuring that the methods we create do what they are supposed to do.

In this - kind of - series, I'm going to dive into basic concepts of the **MS Test Framework**. I'll show you some important concepts often ignored.

In this article, I'll analyse the Assert class and some of the methods that are ignored or misunderstood.  
In the second article of this series I'll explain another useful class that only a few people use in their test: the StringAssert class.  
Another class to keep in mind CollectionAssert, that will be the topic of the third part of this series -spoiler alert: it is about collections!  
Let's have a go!

WAIT A MINUTE! This will be a loooong post, but don't panic, that's just because there are lots of examples!

![Your reaction right now](https://media.giphy.com/media/3o6Ztl3rRVq6yZ5MT6/giphy.gif)

## Basic concepts

With Visual Studio we can create Unit Tests for our projects. Here's a simple example:

```cs
[TestMethod()]
 public void MyFirstTest()
 {
     Assert.IsTrue(true);
 }
```

This is a terribly, terribly, dumb test: it checks if _true_ is true.

As you can see, the Assert class contains static methods, and it says if the test will pass or will fail.

Note 1: the Assert class is not native of C#: its namespace is `Microsoft.VisualStudio.TestTools.UnitTesting`.

Note 2: you cannot create sub-classes since **this class is sealed**.

This class provides the most general checks, those based on equality and general assertions. You can find the documentation [on this page](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting.assert "Unit testing page on Microsoft docs").

For almost every method I'll show in this article there is a specular method that checks if the condition is not verified. For Assert.IsTrue there is Assert.IsFalse, for Assert.AreEqual there is Assert.AreNotEqual and so on. The only exception here is the *ThrowsException* method.

Every method has two overrides that allow you to add an error message as a string and to provide custom parameters to pass to the string, in order to format it as you do with `String.Format()`.

## Assert.IsTrue

With these methods you can check if a generic condition is true or false.

```csharp
[TestMethod]
 public void TestIsTrue()
 {
     int x = 20;
     Assert.IsTrue(x > 15);
 }
```

## Assert.AreEqual

This methods checks if the two parameters, have the same value or not.

There are lots of overloads for this method, depending on the type of parameters under the microscope.

For each type passed as a parameter, there are different parameters.

### Assert.AreEqual with Int values

```cs
[TestMethod]
 public void TestInt()
 {
     var expected = 15;
     var actual = 3 * 5;
     Assert.AreEqual(expected, actual);
 }
```

You can check if two Int are equals. But you can use also Int16, Int32 and Int64 to be compared:

```cs
[TestMethod]
 public void TestIntWithDifferentTypes()
 {
     Int32 expected = 15;
     Int64 actual = 3 * 5;
     Assert.AreEqual(expected, actual);
 }
```

### Assert.AreEqual with Single and Double values

Since the values are always rounded in a way that depends on the inner representation of the Single and Double data type, you must specify a third value for the comparison: the **delta**.

So, the test will fail if the actual value differs more than delta from the expected value.

```cs
[TestMethod]
 public void TestOnDouble()
 {
     double expected_double = 12.3566d;
     double actual_double = 12.358d;
     Assert.AreEqual(expected_double, actual_double, 0.05d);//OK
     Assert.AreEqual(expected_double, actual_double, 0.000005d); //KO
 }
```

```cs
[TestMethod]
 public void TestOnSingle()
 {
     float expected_float = 0.0557f;
     float actual_float = 0.055652f;
     Assert.AreEqual(expected_float, actual_float, 0.001); //OK
     Assert.AreEqual(expected_float, actual_float, 0.00000001); //KO
 }
```

### Assert.AreEqual with String values

This overload was made for the simple comparison of strings.

```cs
[TestMethod]
 public void TestOnStrings()
 {
     string expected = "FOO";
     string actual = "foo".ToUpper();
     Assert.AreEqual(expected, actual);
 }
```

#### Case sensitivity

With a Boolean flag you can specify whether the comparison must ignore case.

```cs
[TestMethod]
 public void TestOnCaseInsensitiveStrings()
 {
     string expected = "FOO";
     string actual = "foo";
     Assert.AreEqual(expected, actual, true); //OK
 }
```

#### CultureInfo

Sometimes you need to check if two strings are equals according to a specific culture. Well, you can add a *CultureInfo* parameter to the method to achieve the result.

You might think "Do I really need to check for the culture?". Usually not, unless you are Turkish.

#### The Turkish i problem

Have you ever heard of the *Turkish I problem*? In short, for the Turkish alphabet **the uppercase _i_ is not _I_, but _İ_**. You can see a more detailed article [here](https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx "Turkish I problem article").

So when comparing strings you should keep this problem in mind.

```cs
[TestMethod]
 public void TestOnTurkishI()
 {
     var turkishCulture = CultureInfo.CreateSpecificCulture("tr-TR");
     var baseString = "i love you";
     var turkishToUpperString = baseString.ToUpper(turkishCulture);
     var turkishUpperString = "İ LOVE YOU";
     var baseToUpperString = baseString.ToUpper();
     Assert.AreEqual(turkishToUpperString, turkishUpperString, false, turkishCulture); //OK
     Assert.AreEqual(baseToUpperString, turkishToUpperString); //KO
 }
```

### Assert.AreEqual with Objects

With objects things get a bit more complicated. Let's say we have this class:

```cs
class User
 {
     public int Id { get; set; }
     public string Username { get; set; }
 }
```

Now have a look at this test:

```cs
[TestMethod]
 public void TestAreEqualObjects()
 {
     User expected = new User() { Id = 1, Username = "Tetris" };
     User actual = new User() { Id = 1, Username = "Tetris" };
     Assert.AreEqual(expected, actual);
 }
```

Will the test pass? The answer is... NO! Why?

Well, the two objects look identical and have the same values for every field. But **they refer to different memory locations**. As you know, equality on objects is made on the object reference - [here](https://coding.abel.nu/2014/09/net-and-equals/ ".NET equals article") a really good article.

So... How can we pass the test?

#### Override Equals

The solution is to override the `Equals()` method of the *Object* class. This will let you specify a custom way to compare two objects without comparing the object reference.  
First of all, I've created a new class, UpdatedUser, that is similar to the User class seen before but with an override of the _Equals_ method.

```cs
private class UpdatedUser
 {
     public int Id { get; set; }
     public string Username { get; set; }
     public override bool Equals(object obj)
     {
         return Id == ((UpdatedUser)obj).Id;
     }
 }
```

Now we can play with this new class.

```cs
[TestMethod]
 public void TestAreEqualObjectsWithOverride()
 {
     UpdatedUser expected = new UpdatedUser() { Id = 1, Username = "Tetris" };
     UpdatedUser actual = new UpdatedUser() { Id = 1, Username = "Tetris" };
     Assert.AreEqual(expected, actual);
 }
```

### Assert.AreEqual with Structs

And what about structs? Oh, come on, who uses structs?? Well, who am I to judge you? :)

![You are using structs??](https://media.giphy.com/media/fGnPmGqbBaB1e/giphy.gif)

Ok, seriously. Structs are just like value types like _int_, but they can add additional fields.

```cs
private struct Employee
 {
     public int Id { get; set; }
     public int Age { get; set; }
 }
```

So the equality check is the simplest you can imagine.

## Assert.AreSame

This method checks if **the references of the two values** are the same.

```cs
[TestMethod]
 public void TestAreEqualsStructs()
 {
     var a = new Employee() { Id = 1, Age = 35 };
     var b = new Employee() { Id = 1, Age = 35 };
     Assert.AreEqual(a, b);
 }
```

As you can see, *a* and *b* are exactly the same struct, so the override of the *Equals* method is not necessary. With this method you can verify by yourself that when adding an element in a List you are adding a reference to an object, not cloning that one:

```cs
[TestMethod]
 public void TestAreSameObjectsInList()
 {
     User expected = new User() { Id = 2, Username = "Rocky" };
     List userList = new List();
     userList.Add(expected);
     User actual = userList.First();
     Assert.AreSame(expected, actual);
 }
```

## Assert.IsInstanceOfType

Well, you can imagine what this method does... In the examples below I'll show you also the IsNotInstanceOfType method, just to have a countercheck on what is inheritance. In fact, in this example I created the *AdminUser* class that extends the *User* class seen before.

```cs
private class AdminUser : User
 {
     public string Department { get; set; }
 }
```

```cs
[TestMethod]
 public void TestInstanceOfType()
 {
     User user = new AdminUser()
     {
         Id = 1,
         Username = "BigBoss",
         Department = "Olympus"
     };
     Assert.IsInstanceOfType(user, typeof(AdminUser));
 }
 [TestMethod]
 public void TestNotInstanceOfType()
 {
     User user = new User() { Id = 2, Username = "SimpleMan" };
     Assert.IsNotInstanceOfType(user, typeof(AdminUser));
 }
```

## Assert.IsNull

It's not difficult to guess what this method checks...

```cs
[TestMethod]
 public void TestIsNull()
 {
     string nullString = null;
     Assert.IsNull(nullString);
 }
```

## Assert.ThrowsException

Until now we assumed that all our methods return a value, and that we should just check if that value is correct. But some times methods throw exceptions, and we have to handle them.   
That's why this method comes handy.

Suppose you have a simple method like this one:

```cs
public bool IsAuthorized(string username)
 {
     if (String.IsNullOrWhiteSpace(username))
     {
         throw new Exception();
     }
     return true;
 }
```

We know that the method won't fail if you pass a valid username. But we also want to ensure that with a specific condition it will throw an exception.
And we can check it this way:

```cs
[TestMethod]
 public void TestThrowsException()
 {
     string userName = null;
     Assert.ThrowsException(() => IsAuthorized(userName));
 }
```

Perfect! Or not?  
What if the exception thrown is not of the same type of the one expected?  
Let's modify the IsAuthorized method.

```cs
public bool IsAuthorized(string username)
 {
     if (String.IsNullOrWhiteSpace(username))
     {
         throw new ArgumentNullException();
     }
     return true;
 }
```

This way we are giving more information on why the method fails. But the test seen before will fail, because that's not the exception expected (we are expecting an *Exception* but we receive an *ArgumentNullException*).

Is there a way to create generic tests?  
Well... no.

Just look at what happens in the *ThrowsException* method and find out why.

```cs
public static T ThrowsException(Action action, string message, params object[] parameters) where T : Exception
 {
     string empty = string.Empty;
     if (action == null)
     {
         throw new ArgumentNullException("action");
     }
     if (message == null)
     {
         throw new ArgumentNullException("message");
     }
     try
     {
         action();
     }
     catch (Exception ex)
     {
         if (!typeof(T).Equals(((object)ex).GetType()))
         {
             empty = string.Format(CultureInfo.CurrentCulture, FrameworkMessages.WrongExceptionThrown, ReplaceNulls(message), typeof(T).get_Name(), ((object)ex).GetType().get_Name(), ex.Message, ex.StackTrace);
             HandleFail("Assert.ThrowsException", empty, parameters);
         }
         return (T)ex;
     }
     empty = string.Format(CultureInfo.CurrentCulture, FrameworkMessages.NoExceptionThrown, new object[2]
     {
 ReplaceNulls(message),
 typeof(T).get_Name()
     });
     HandleFail("Assert.ThrowsException", empty, parameters);
     return null;
 }
```

## Wrapping Up

This was a long article, I know. But here I have listed a few methods I don't see used as much as they should. As I said before, nearly every method has its negative counterpart, so you have a rich set of checks to use.

In the next article we'll have a look at the StringAssert class, that's -obviously- specific for strings.
