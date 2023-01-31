---
title: "C# Tip: do NOT use nameof to give constants a value"
path: "/csharptips/do-not-use-nameof-for-constants"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "In C#, nameof can be quite useful. But it has some drawbacks, if used the wrong way."
created: 2023-01-31
updated: 2023-01-31
---

As per Microsoft's definition,

> A `nameof` expression produces the name of a variable, type, or member as the string constant.

This means that you can have, for example

```cs
void Main()
{
    PrintItems("hello");
}

public void PrintItems(string items)
{
    Console.WriteLine(nameof(items));
}
```

that will print "items", and not "hello": this is because we are printing the name of the variable, items, and not its runtime value.

## A real example I saw in my career

In some of the projects I've worked on during these years, I saw an odd approach that I highly recommend NOT to use: populate constants with the name of the constant itself:

```cs
const string User_Table = nameof(User_Table);
```

and then use the constant name to access stuff on external, independent systems, such as API endpoints or Databases:

```cs
const string User_Table = nameof(User_Table);

var users = db.GetAllFromTable(User_Table);
```

The reasons behind this, in my teammates opinion, are that:

1. It's easier to write
2. It's more performant: we're using constants that are filled at compile time, not at runtime
3. You can just rename the constant if you need to access a new database table.

**I do not agree with them**: expecially the third point is pretty problematic.

## Why this approach should not be used

We are binding the data access to the name of a constant, and not to its value.

We could end up in big trouble because if, from one day to the next, the system might not be able to reach the User table because the name does not exist.

How is it possible? It's a constant, it can't change! **No: it's a constant whose value changes if the contant name changes**.

It can change for several reasons:

1. A developer, by mistake, renames the constant. For example, from `User_Table` to `Users_Table`.
2. An automatic tool (like a Linter) with wrong configurations updates the constants' names: from `User_Table` to `USER_TABLE`.
3. New team styleguides are followed blindly: if the new rule is that "constants must not contain hyphens" and you apply it everywhere, you'll end in trouble.

To me, those are valid reasons not to use `nameof` to give a value to a constant.

## How to overcome it

If this approach is present in your codebase and it's too time-consuming to update it everywhere, not everything is lost.

You must absolutely do just one thing to prevent all the issues I listed above: **add tests, and test on the actual value**.

If you're using Moq, for instance, you should test the database access we saw before as:

```cs
// initialize and run the method
[...]

// test for the Table name
_mockDb.Verify(db => db.GetAllFromTable("User_Table"));
```

Notice that here **you must test against the actual name of the table**: if you write something like

```cs
_mockDb.Verify(db => db.GetAllFromTable(It.IsAny<string>()));
```

or

```cs
_mockDb.Verify(db => db.GetAllFromTable(DbAccessClass.User_Table));
//say that DbAccessClass is the name of the class the uses the data access showed above
```

the whole test becomes pointless.

## Further readings

This article lies in the middle of my [C# tips 🔗](https://www.code4it.dev/tag/csharp-tip) and my [Clean Code tips 🔗](https://www.code4it.dev/tag/clean-code-tip).

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

In this article, we've learned that you _could_ value a constant with its own name, using `nameof`, but also that you _shouldn't_.

Have you ever seen this approach? In your opinion, what are some other benefits and disadvantages of it? Drop a comment below! 📩

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
