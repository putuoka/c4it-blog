---
title: "C# Tip: Use a SortedSet to avoid duplicates and sort items"
path: "/csharptips/sorted-set"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "Using the right data structure is crucial to building robust and efficient applications. So, why use a List or a HashSet to sort items (and remove duplicates) when you have a SortedSet?"
created: 2021-11-16
updated: 2021-11-16
---

As you probably know, you can create collections of items without duplicates by using a `HashSet<T>` object.

It is quite useful to remove duplicates from a list of items of the same type.

How can we ensure that we always have sorted items? The answer is simple: `SortedSet<T>`!

## HashSet: a collection without duplicates

A simple `HashSet` creates a collection of unordered items without duplicates.

This example

```cs
var hashSet = new HashSet<string>();
hashSet.Add("Turin");
hashSet.Add("Naples");
hashSet.Add("Rome");
hashSet.Add("Bari");
hashSet.Add("Rome");
hashSet.Add("Turin");


var resultHashSet = string.Join(',', hashSet);
Console.WriteLine(resultHashSet);
```

prints this string: _Turin,Naples,Rome,Bari_. The order of the inserted items is maintained.

## SortedSet: a sorted collection without duplicates

To sort those items, we have two approaches.

You can simply sort the collection once you've finished adding items:

```cs
var hashSet = new HashSet<string>();
hashSet.Add("Turin");
hashSet.Add("Naples");
hashSet.Add("Rome");
hashSet.Add("Bari");
hashSet.Add("Rome");
hashSet.Add("Turin");

var items = hashSet.ToList<string>().OrderBy(s => s);


var resultHashSet = string.Join(',', items);
Console.WriteLine(resultHashSet);

```

Or, even better, **use the right data structure**: a `SortedSet<T>`

```cs
var sortedSet = new SortedSet<string>();

sortedSet.Add("Turin");
sortedSet.Add("Naples");
sortedSet.Add("Rome");
sortedSet.Add("Bari");
sortedSet.Add("Rome");
sortedSet.Add("Turin");


var resultSortedSet = string.Join(',', sortedSet);
Console.WriteLine(resultSortedSet);
```

Both results print _Bari,Naples,Rome,Turin_. But the second approach does not require you to sort a whole list: it is more efficient, both talking about time and memory.

## Use custom sorting rules

What if we wanted to use a `SortedSet` with a custom object, like `User`?

```cs
public class User {
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public User(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
}
```

Of course, we can do that:

```cs
var set = new SortedSet<User>();

set.Add(new User("Davide", "Bellone"));
set.Add(new User("Scott", "Hanselman"));
set.Add(new User("Safia", "Abdalla"));
set.Add(new User("David", "Fowler"));
set.Add(new User("Maria", "Naggaga"));
set.Add(new User("Davide", "Bellone"));//DUPLICATE!

foreach (var user in set)
{
    Console.WriteLine($"{user.LastName} {user.FirstName}");
}
```

But, we will get an error: **our class doesn't know how to compare things**!

That's why we must update our `User` class so that it implements the `IComparable` interface:

```cs
public class User : IComparable
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public User(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public int CompareTo(object obj)
    {
        var other = (User)obj;
        var lastNameComparison = LastName.CompareTo(other.LastName);

        return (lastNameComparison != 0)
            ? lastNameComparison :
            (FirstName.CompareTo(other.FirstName));
    }
}
```

In this way, everything works as expected:

```txt
Abdalla Safia
Bellone Davide
Fowler David
Hanselman Scott
Naggaga Maria
```

Notice that the second Davide Bellone has disappeared since it was a duplicate.

_This article first appeared on [Code4IT](https://www.code4it.dev/)_

## Wrapping up

Choosing the right data type is crucial for building robust and performant applications.

In this article, we've used a `SortedSet` to insert items in a collection and expect them to be sorted and without duplicates.

I've never used it in a project. So, how did I know that? I just explored the libraries I was using!

From time to time, spend some minutes reading the documentation, have a glimpse of the most common libraries, and so on: you'll find lots of stuff that you've never thought existed!

**Toy with your code! Explore it. Be curious.**

And have fun!

🐧
