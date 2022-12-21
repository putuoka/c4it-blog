---
title: "MSTest CollectionAssert class - an overview"
path: "/blog/mstests-collectionassert-overview"
tags: ["CSharp", "Tests", "MainArticle"]
featuredImage: "./cover.jpg"
excerpt: "The CollectionAssert class if fine for basic tests on collections in C#. We will have a look at the methods exposed by this class."
created: 2020-02-04
updated: 2020-02-04
---

This is the third part of our journey. In the [first part](./mstests-assert-overview "Unit testing with Assert") we listed the methods belonging to the **Assert** class, while in the [second part](./mstests-stringassert-overview "Unit testing with StringAssert") we had a look at the **StringAssert** class.

Now we'll deep dive into the CollectionAssert class, that is a good fit for ensuring that a collection of elements follows desired specifications.

## Introduction to CollectionAssert

[This class](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.testtools.unittesting.collectionassert "CollectionAssert class on Microsoft") tests various conditions associated with collections, like tests about the type of the elements. It is important to say that this class does not check if every element in the collection follows a certain rule (like "The ID must be greater than 0"), but it's more about **high level checks**.

For these examples I'll reuse two classes created for the first article of this series: _User_ and _AdminUser_: the second class extends the first one:

```cs
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
}

public class AdminUser : User
{
    public string Department { get; set; }
}

```

## CollectionAssert.AllItemsAreInstancesOfType

With this method we can check if all the elements belonging to a collection are of the same type.

A simple example could be the one with a list of strings.

```csharp
[TestMethod]
public void AllItemsAreInstanceOfType_String()
{
    string[] stringArray = new string[] { "Hello", "darkness", "my", "old", "friend" };

    CollectionAssert.AllItemsAreInstancesOfType(stringArray, typeof(string));
}
```

Of course all the elements in the `stringArray` array are all strings, so it's easy to guess that the test will pass.

What about object? In the next test I'll create a List of `User` elements, but with also a `AdminUser` object.
You should remember that AdminUser is also a User, but the vice versa is not true.

```csharp
[TestMethod]
public void AllItemsAreInstanceOfType_AreAllUsers()
{
    List<User> list = new List<User>()
    {
        new User(){ Username = "Elvis", Id=1},
        new User(){ Username="Janis", Id=2},
        new AdminUser(){ Username="Freddie", Id=3, Department="Legends"}
    };

    CollectionAssert.AllItemsAreInstancesOfType(list, typeof(User)); //Pass
    CollectionAssert.AllItemsAreInstancesOfType(list, typeof(AdminUser)); //Fail
}
```

The first test will pass, but the second one will fail because the object with Username = "Freddie" is the only object of type `AdminUser`.

## CollectionAssert.AllItemsAreNotNull

This method is pretty straightforward: if an element in the collection is `null` it will fail.

```cs
[TestMethod]
public void AllItemsAreNotNull()
{
    List<User> list = new List<User>() {
        new User(){Username= "Elvis", Id=1},
        null,
        new AdminUser(){ Username="Freddie", Id=3, Department="Legends"}
    };

    CollectionAssert.AllItemsAreNotNull(list);
}

```

Of course the test above will fail.

## CollectionAssert.AllItemsAreUnique

The name is explicative.

The test below will pass:

```cs
[TestMethod]
public void AreAllItemsUnique_integers()
{
    int[] array = new int[] { 1, 2, 3, 9, 7 };
    CollectionAssert.AllItemsAreUnique(array);
}
```

But life is not meant to be lived with only integers.
And that's where things become a bit harder.

```cs
[TestMethod]
public void AreAllItemsUnique_Users()
{
    User[] array = new User[] {
        new User(){Username= "Elvis", Id=1},
        new User(){Username= "Elvis", Id=1}
    };
    CollectionAssert.AllItemsAreUnique(array);
}
```

Well, Elvis will be unique forever... but not here! The `array` variable contains two different instances of `User`, even if the properties have the same value. So this test will fail.

Digging a bit more into the `AllItemsAreUnique` class we can see that internally it works with dictionaries:

```cs
public static void AllItemsAreUnique(ICollection collection, string message, params object[] parameters)
{
	Assert.CheckParameterNotNull(collection, "CollectionAssert.AllItemsAreUnique", "collection", string.Empty);
	message = Assert.ReplaceNulls(message);
	bool flag = false;
	Dictionary<object, bool> dictionary = new Dictionary<object, bool>();
	foreach (object item in collection)
	{
		if (item == null)
		{
			if (!flag)
			{
				flag = true;
			}
			else
			{
				string message2 = string.Format(CultureInfo.CurrentCulture, FrameworkMessages.AllItemsAreUniqueFailMsg, new object[2]
				{
					(message == null) ? string.Empty : message,
					FrameworkMessages.Common_NullInMessages
				});
				Assert.HandleFail("CollectionAssert.AllItemsAreUnique", message2, parameters);
			}
		}
		else if (dictionary.ContainsKey(item))
		{
			string message3 = string.Format(CultureInfo.CurrentCulture, FrameworkMessages.AllItemsAreUniqueFailMsg, new object[2]
			{
				(message == null) ? string.Empty : message,
				Assert.ReplaceNulls(item)
			});
			Assert.HandleFail("CollectionAssert.AllItemsAreUnique", message3, parameters);
		}
		else
		{
			dictionary.Add(item, value: true);
		}
	}
}
```

Ok, it's not so exciting, but I wanted to show you what's under the hood and how comparinson is handled.

So, let's get back to our problem: how can we make that test pass?

We must override the `Equals` and the `GetHashCode` method. Even here I reuse the `UpdatedUser` class from the first article

```cs
public class UpdatedUser
{
    public int Id { get; set; }
    public string Username { get; set; }
    public override bool Equals(object obj)
    {
        return Id == ((User)obj).Id;
    }

    public override int GetHashCode()
    {
        return base.GetHashCode();
    }
}
```

Now the test will pass.

## CollectionAssert.AreEqual

If you want to check if two collections are identical, you can use `AreEqual`. This checks if the same elements are **in the same position** in both collections.

For example this test will pass:

```cs
[TestMethod]
public void AreEqual_Int()
{
    int[] array1 = new int[] { 1, 2, 3, 4, 5, 6 };
    int[] array2 = new int[] { 1, 2, 3, 4, 5, 6 };
    CollectionAssert.AreEqual(array1, array2); //OK
}
```

But the following will fail:

```cs
[TestMethod]
public void AreEqual_DifferentPosition_Int()
{
    int[] array1 = new int[] { 1, 2, 3, 5, 4, 6 };
    int[] array2 = new int[] { 1, 2, 3, 4, 5, 6 };
    CollectionAssert.AreEqual(array1, array2); //KO
}

```

As we saw before, with simple objects it doesn't work:

```cs
[TestMethod]
public void AreEqual_Objects()
{
    List<User> list = new List<User>()
    {
        new User(){ Username = "Elvis", Id=1},
        new User(){ Username="Janis", Id=2},
        new AdminUser(){ Username="Freddie", Id=3, Department="Legends"}
    };

    List<User> list2 = new List<User>()
    {
        new User(){ Username = "Elvis", Id=1},
        new User(){ Username="Janis", Id=2},
        new AdminUser(){ Username="Freddie", Id=3, Department="Legends"}
    };

    CollectionAssert.AreEqual(list, list2);
}
```

You have to use the `UpdatedUser` class in order to make it work.

```cs
[TestMethod]
public void AreEqual_ObjectsWithOverride()
{
    List<UpdatedUser> list = new List<UpdatedUser>()
    {
        new UpdatedUser(){ Username = "Elvis", Id=1},
        new UpdatedUser(){ Username="Janis", Id=2}
    };

    List<UpdatedUser> list2 = new List<UpdatedUser>()
    {
        new UpdatedUser(){ Username = "Elvis", Id=1},
        new UpdatedUser(){ Username="Janis", Id=2}
    };

    CollectionAssert.AreEqual(list, list2);
}
```

What about structs? Well, you can imagine, everything is fine.

```cs
[TestMethod]
public void AreEqual_Structs()
{
    List<Employee> list = new List<Employee>()
    {
        new Employee(){ Age = 11, Id=1},
        new Employee(){ Age= 92, Id=2}
    };

    List<Employee> list2 = new List<Employee>()
    {
        new Employee(){ Age = 11, Id=1},
        new Employee(){ Age= 92, Id=2}
    };

    CollectionAssert.AreEqual(list, list2);
}
```

## CollectionAssert.AreEquivalent

While `AreEqual` checks if two collections are identical, there is a more shallow way to test two collections. `AreEquivalent` controls if the same elements are in the two collections, **regardless of their position**.

```cs
[TestMethod]
public void AreEquivalent_Int()
{
    int[] array1 = new int[] { 1, 2, 3, 4, 5, 6 };
    int[] array2 = new int[] { 4, 5, 6, 1, 2, 3 };
    CollectionAssert.AreEquivalent(array1, array2); //OK
}
```

## CollectionAssert.Contains

Ok, this method is easy to guess why it is used for...

```cs
[TestMethod]
public void Contains_Int()
{
    int[] array1 = new int[] { 1, 2, 3, 4, 5, 6 };
    CollectionAssert.Contains(array1, 5); //OK
}
```

## CollectionAssert.IsSubsetOf

Even here, it's pretty easy.

```cs
[TestMethod]
public void IsSubsetOf_Int()
{

    int[] array1 = new int[] { 1, 2, 3, 4, 5, 6 };
    int[] subset = new int[] { 2, 3 };
    CollectionAssert.IsSubsetOf(subset, array1); //OK
}

```

## Wrapping up

We had a review of the `CollectionAssert` class. I think it is very useful for checking if a collection is "well formed", checking for the type of the content and for the presence of an item. But it would be better have also a method for checking if a custom condition is respected by all the element of the collection, for example specifying a lambda expression to be evaluated for each element.

_This article first appeared on [Code4IT](https://www.code4it.dev/)_

## Conclusion

This is the end of this journey through pain and joy. As you can see, MSTest is fine for basic tests, but if you want something more complete I suggest to use other libraries.

My favorite, by now, is [FluentAssertion](https://fluentassertions.com "FluentAssertion website"). It replaces the `Assert` class with a syntax that allows you to create more complex tests. It is more readable (well, _fluent_) and a test looks like:

```cs
[TestMethod]
public void MustContain()
{

    int[] array = new int[] { 1, 2, 3, 4, 5 };

    array.Should().Contain(4);
}
```

I think that MSTest is perfect if you are moving your first steps in the world of unit testing, but when the complexity grows you should consider to adopt other frameworks.
