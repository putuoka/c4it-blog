---
title: "5 things you didn't know about Guid in C#"
path: "/blog/5-things-about-guid-in-csharp"
tags: ['CSharp']
featuredImage: "./cover.jpg"
excerpt: "I'm pretty sure that you've already used Guids in C#, but have you ever stopped to think what they are under the hood?an 3 seconds to load. Here you'll learn few trick to improve your site performance."
created: 2020-01-21
updated: 2020-01-21
---


I'm pretty sure that you've already used Guids in C#, but have you ever stopped to think what they are under the hood?

## #1: Guids have a fixed size

A GUID is a 128-bit integer (16 bytes) value. That means that there are __more than 300,000,000,000,000,000,000,000,000,000,000,000,000 different values__. A big number, isn't it?

It is virtually impossible to have duplicates, so it is safe to use.

Notice that an _unsigned long_ is made of 64 bits: the biggest integral value that we can have has half of the bits of a Guid. The only type with the same size is decimal, but here we must consider both the sign and the precision.

## #2: Guid is a struct

Just like int and short, a Guid is a struct and not an object.

```cs
public struct Guid : IComparable, IComparable, IEquatable, IFormattable
```

Since this is a value type, if we pass it to a method, it won't change its value:

```cs
void Main()
{
    var initialGuid = Guid.NewGuid();
    Console.WriteLine("Before: "+ initialGuid);

    updateGuid(initialGuid);
    Console.WriteLine("After: "+ initialGuid);
}

void updateGuid(Guid tmpGuid){
    tmpGuid = Guid.NewGuid();
}
```

will print

```
Before: d7241bf7-2778-42a9-a2e2-99228ada8c54
After: d7241bf7-2778-42a9-a2e2-99228ada8c54
```

But, if we use the _ref_ keyword

```cs
void Main()
{
    var initialGuid = Guid.NewGuid();
    Console.WriteLine("Before: "+initialGuid);

    updateGuidRef(ref initialGuid);
    Console.WriteLine("AfterRef: "+initialGuid);
}

void updateGuidRef( ref Guid tmpGuid)
{
    tmpGuid = Guid.NewGuid();
}
```

we will have

```
Before: f93239da-4d20-4cb9-a8b7-df9002e4a042
AfterRef: b4274547-089b-42c9-a2d1-5d4d3a62f37a
```

## #3: You can create a Guid

For sure, the typical way of creating a Guid is using the static method `Guid.NewGuid()`. There are other ways to generate them.

If you want to create an empty Guid, you can use `Guid.Empty`: it will return a Guid composed only by 0s, like _00000000-0000-0000-0000-000000000000_. Since we are talking about a struct, it doesn't make sense to have a null value, of course!

If you already have a GUID stored as string, you can parse it with `Guid.Parse` and `Guid.TryParse`. Just like for DateTime and for integers, the first one works only if the input string has a valid value, the second one tries to parse a value and assign it to a variable.

```cs
var guid1 = Guid.Parse("fc072692-d322-448b-9b1b-ba3443943579");
Console.WriteLine("Guid1: " + guid1);

Guid.TryParse("fc072692-d322-448b-9b1b-ba3443943579", out var guid2);
Console.WriteLine("Guid2: "+guid2);
```

You can also use the simple constructor, like

```cs
var guid = new Guid("fc072692-d322-448b-9b1b-ba3443943579");
```

or some of the more advanced constructors that operate at low level: for example, you can use a byte array as an input to the constructor, and have it converted to Guid.
Of course, the array must be of 16 bytes.

```cs
var bytes = new byte[16];
var guid = new Guid(bytes); // 00000000-0000-0000-0000-000000000000
```

## #4: A Guid has multiple formats

Now that you know that a Guid is made of 16 bytes, you can think "are the hyphens part of those bytes?".

Well, no: those are part of the default string representation of a Guid. 

When using the `ToString()` method you can specify the format that you want. There are different types:

* __D__: 32 digits, but with the hyphens. This is the default
* __N__: 32 digits, without any other symbols
* __B__: here we have the hyphens, and the string is enclosed in braces
* __P__: similar to __B__, but with parentheses instead of braces
* __X__: here we have the hexadecimal representation of the guid.

If we try to print the same Guid with the different formats, we can have something like

```cs
var tmpGuid = Guid.NewGuid();
Console.WriteLine("D \t"+tmpGuid.ToString("D"));
Console.WriteLine("N \t"+tmpGuid.ToString("N"));
Console.WriteLine("B \t"+tmpGuid.ToString("B"));
Console.WriteLine("P \t"+tmpGuid.ToString("P"));
Console.WriteLine("X \t"+tmpGuid.ToString("X"));
```

that will print


```cs
D   e10deb88-171b-4c34-81f7-05fc17d16316
N   e10deb88171b4c3481f705fc17d16316
B   {e10deb88-171b-4c34-81f7-05fc17d16316}
P   (e10deb88-171b-4c34-81f7-05fc17d16316)
X   {0xe10deb88,0x171b,0x4c34,{0x81,0xf7,0x05,0xfc,0x17,0xd1,0x63,0x16}}
```

Do you remember the `Guid.Parse` method that I showed before? Well, there is a secret sibling! `Guid.ParseExact` converts a string into a Guid only if it has the expected format.

So

```cs
Guid.ParseExact("(e10deb88-171b-4c34-81f7-05fc17d16316)", "P");
```

will work, but

```cs
Guid.ParseExact("(e10deb88-171b-4c34-81f7-05fc17d16316)", "N");
```

and

```cs
Guid.ParseExact("{e10deb88-171b-4c34-81f7-05fc17d16316}", "P");
```

won't.

## #5: Guids have NOT a fixed size

As I said, a Guid takes 16 bytes. So it's easy to suppose that `sizeof(Guid)` will return 16.

Well... no! It doesn't even compile, because _'Guid' does not have a predefined size; therefore you can use `sizeof`only in an unsafe context.

That's because the size of a Guid is constant, but the memory allocated by the CLR isn't necessary constant (because for some architecture it can add a padding at the end, at the beginning or within the allocated memory).

So, you can see the value in 2 ways:
using the `unsafe` operator

```cs
unsafe
{
    sizeof(Guid);
}
```

or using the `Marshal.SizeOf` method from `System.Runtime.InteropServices`.

```cs
Marshal.SizeOf()
```

## Wrapping up

Not so boring, isn't it? For sure, this is a great functionality of C#, and I hope I've triggered your curiosity about the hidden aspects of this language.

Happy coding!