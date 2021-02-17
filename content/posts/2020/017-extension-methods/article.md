---
title: "How you can create extension methods in C#"
path: "/blog/csharp-extension-methods"
tags: ['C#', 'dotNET']
featuredImage: "./cover.jpg"
excerpt: "Extension methods in C# are really useful, but there are few rules to follow..."
created: 2020-02-18
updated: 2020-02-18
---

Probably you have already heard of __extension methods__: those are C# methods used to add new functionalities to an existing class. 

This functionality is available since C# 3.0, so it's largely used and [well documented](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods). 

## The basics of extension method

Let's say that you have a __non-static class__ that you cannot modify, maybe because it comes from an external library.

```cs
public class Person
{
    public DateTime BirthDate { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string GetFullName() => $"{Surname} {Name}";
}
```

For the Person class we have only the `GetFullName` method.

So we can use the Person class this way:

```cs
var person = new Person() { 
    Name = "Davide", 
    Surname = "Bellone", 
    BirthDate = new DateTime(1990, 1, 1)
    };

Console.WriteLine(person.GetFullName());
```

Nothing difficult, right?

Now we want to get the full name with the birthdate. We have 2 ways to achieve this: using a subclass - terrible idea - or creating an extension method. Let's go with the second approach!

First of all, we need a __static class__ that contains our method:

```cs
public static class MyExtensions
{
    // Your methods here
}
```

Now we can create the new method. We must remember 2 things:

* it must be a __static method__
* __the first parameter__ must be of the same type we want to extend and must be __preceded by the `this` keyword__

```cs
public static string GetFullNameWithBirthDate(this Person person)
{
    return $"{person.BirthDate.ToString("yyy-MM-dd")} - {person.Surname} {person.Name}";
}
```

Now we can use it with `person.GetFullNameWithBirthDate()`. Easy-peasy.

If you use Visual Studio and you have the Intellisense enabled, you will see those hints, both on the icon and on the description of the method.

![Intellisense with extension method](https://res.cloudinary.com/bellons/image/upload/t_content-image/Code4IT/Articles/2020/Extension-methods/Intellisense-person.png)

Behind the scenes, we are calling the method on the MyExtensions class, not on the person object. Extension methods act just as shortcuts.

```cs
person.GetFullNameWithBirthDate()
MyExtensions.GetFullNameWithBirthDate(person);
```

Ok, we have seen an overview of this functionality. Let's go more in details.

## Visibility matters

As you may imagine, since extension methods are meant to extend the public behavior of a class, you cannot use a private field (or method) of that class.

So, if we have a `private string ID` to our Person class, it won't be accessible from the extension method.

Of course, you can use both public properties and public methods. In fact, we can do refactor `GetFullNameWithBirthDate` to

```cs
public static string GetFullNameWithBirthDate(this Person person)
{
    return $"{person.BirthDate.ToString("yyy-MM-dd")} - {person.GetFullName()}";
}
```

## You can extend subclasses

Say that you have a `Student` class that extends `Person`:

```cs
public class Student : Person
{
    public int StudentId { get; set; }

}
```

Now, among our extension methods, we can add functionalities to Student, and reference the Person class:

```cs
public static string GetFullStudentInfo(this Student student) {
    return $"{student.GetFullName()} - ID: {student.StudentId}";
}
```

Finally, we can create extension methods that will override the ones created for the base class:

```cs
public static string GetInitials(this Student student)
    => $"Student: {student.Surname.ToCharArray()[0]}.{student.Name.ToCharArray()[0]}.";

public static string GetInitials(this Person person)
    => $"Person: {person.Surname.ToCharArray()[0]}.{person.Name.ToCharArray()[0]}.";
``` 

So, now 

```cs
var student = new Student() {
    Name = "Elon",
    Surname = "Musk",
    BirthDate = new DateTime(1971, 6, 28),
    StudentId = 123 };

Console.WriteLine(student.GetFullNameWithBirthDate());
Console.WriteLine(student.GetFullStudentInfo());

Console.WriteLine(student.GetInitials());
```

will print out

```
1971-06-28 - Musk Elon
Musk Elon - ID: 123
Student: M.E.
``` 

## A real life example: LINQ

Since C# 3.5 we have a new query language: __LINQ__.

LINQ stands for _Language-Integrated Query_, and it is often used when you are working on collections and you need to do some operations on them, like get all the values that match a particular condition or take only the first element of the collection.

An example can be

```cs
List<int> myList = new List<int>() { 2, 4, 82, 6, 223, 5, 7, 342, 234, 1};
myList.First();
``` 

By default, `List<T>` does not include a method that returns the first element of the collection. To use it, we need to include LINQ by putting `using System.Linq` among the imports.

So yes, we can say that First is a method that extends the List class: __LINQ is a set of extension methods!__

In fact, we can read [its source code](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/First.cs) and notice this:

```cs
namespace System.Linq
{
    public static partial class Enumerable
    {
        public static TSource First<TSource>(this IEnumerable<TSource> source)
        {
            TSource first = source.TryGetFirst(out bool found);
            if (!found)
            {
                ThrowHelper.ThrowNoElementsException();
            }

            return first;
        }
        // other methods
    }
}
```

So, you can extend this library if you want. Let's say that you need to get a random element from the list; you can create a method like this:

```cs
public static T GetRandom<T> (this IEnumerable<T> source)
{
if (source == null || source.Count() == 0)
    throw new ArgumentException(nameof(source)) ;
Random rd = new Random();
return source.ElementAt(rd.Next(0, source.Count()));
}
```

And call it this way:

```cs
List<int> myList = new List<int>() { 2, 4, 82, 6, 223, 5, 7, 342, 234, 1};
Console.WriteLine(myList.GetRandom());
```

## Wrapping up

Have you ever used extension methods for creating a library?

Anyway, here's a short recap of the main points:

* all in a static class
* each method must be static
* the extended class must be non-static
* the first parameter must be preceded by the _this_ keyword
* you can use only public fields and methods
* you can extend classes, but also subclasses and structs
* the greatest example of library based on extension methods is LINQ

You can see the full example [here](https://gist.github.com/bellons91/6005ebf8c5c42e036cf98b2bfe40a903#file-extension-methods-example-cs).
