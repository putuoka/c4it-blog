---
title: "C# Tip: SelectMany in LINQ"
path: '/csharptips/linq-selectmany'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "SelectMany is one of the LINQ methods I've used the least. I couldn't get it! Turns out it was actually incredibly simple."
created: 2022-07-12
updated: 2022-07-12
---

There's one LINQ method that I always struggle in understanding: SelectMany.

It's actually a pretty simple method, but somehow it doesn't stuck in my head.

In simple words, SelectMany works on collections of items that you can use, in whichever way, to retrieve other items.

Let's see an example using the dear old `for` loop, and then we will replace it with `SelectMany`.

For this example, I've created a simple record type that represents an office. Each office has one or more phone numbers.

```cs
record Office(string Place, string[] PhoneNumbers);
```

Now, our company has a list of offices. 

```cs
List<Office> myCompanyOffices = new List<Office>{
    new Office("Turin", new string[]{"011-1234567", "011-2345678", "011-34567890"}),
    new Office("Rome", new string[]{"031-4567", "031-5678", "031-890"}),
    new Office("Dublin", new string[]{"555-031-4567", "555-031-5678", "555-031-890"}),
};
```

How can we retrieve the list of all phone numbers?

## Iterating with a FOR-EACH loop

The most obvious way is to iterate over the collection with a `for` or a `foreach` loop.

```cs
List<string> allPhoneNumbers = new List<string>();

foreach (var office in myCompanyOffices)
{
    allPhoneNumbers.AddRange(office.PhoneNumbers);
}
```

Nothing fancy: we use `AddRange` instead of `Add`, just to avoid another inner loop.

## Using SelectMany

You can do the same thing in a single line using LINQ's `SelectMany`.

```cs
List<string> allPhoneNumbers = myCompanyOffices.SelectMany(b => b.PhoneNumbers).ToList();
```

This method aggregates all the PhoneNumbers elements in an `IEnumerable<string>` instance (but then we need to call `ToList` to convert it).

Of course, always check that the `PhoneNumbers` list is not `null`, otherwise it will throw an `ArgumentNullException`.

The simplest way is by using the `??` operator:

```cs
allPhoneNumbers = myCompanyOffices.SelectMany(b => b.PhoneNumbers ?? Enumerable.Empty<string>()).ToList();
```

## Wrapping up

Easy, right? I don't have anything more to add!

Happy coding!

🐧
