---
title: "Clean Code Tip: Avoid subtle duplication of code and logic"
path: "/cleancodetips/avoid-subtle-duplication"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Duplication is not only about lines of code, but also about data usage and meaning. You should avoid that kind of duplication."
created: 2022-06-28
updated: 2022-06-28
---

Duplication is not only about lines of code, but also about **data usage and meaning.**
Reducing it will help us minimize the impact of every change.

Take this class as an example:

```cs
class BookShelf
{
    private Book[] myBooks = new Book[]
    {
         new Book(1, "C# in depth"),
         new Book(2, "I promessi paperi")
    };

    public int Count() => myBooks.Length;
    public bool IsEmpty() => myBooks.Length == 0;
    public bool HasElements() => myBooks.Length > 0;
}
```

Here, both `Count` and `IsEmpty` use the same logical way to check the length of the collection: by calling `myBooks.Length`.

What happens if you have to change the `myBooks` collection and replace the array of Books with a collection that does not expose the `Length` property? You will have to replace the logic everywhere!

So, a better approach is to "centralize" the way to count the items in the collection in this way:

```cs
class BookShelf
{
    private Book[] myBooks = new Book[]
    {
         new Book(1, "C# in depth"),
         new Book(2, "I promessi paperi")
    };

    public int Count() => myBooks.Length;
    public bool IsEmpty() => Count() == 0;
    public bool HasElements() => Count() > 0;
}
```

If you will need to replace the myBooks data type, you will simply have to update the `Count` method - everything else will be the same.

Also, `HasElements` and `IsEmpty` are a logical duplication. If they're not necessary, you should remove one. **Remove the one most used in its negative form**: if you find lots of `if(!HasElements())`, you should consider replacing it with `if(IsEmpty())`: always prefer the _positive_ form!

Yes, I know, this is an extreme example: it's too simple. But think of a more complex class or data flow in which you reuse the same logical flow, even if you're not really using the exact same lines of code.

By duplicating the logic, you will need to write more tests that do the same thing. Also, it may happen that if you found a flaw in your logic, and you fix it in some places and forget to fix it in other methods.

Centralizing it will allow you to build safer code that is easier to test and update.

A simple way to avoid "logical" duplication? Abstract classes!

Well, there are many others... that I expect you to tell me in the comments section!

Happy coding!

🐧
