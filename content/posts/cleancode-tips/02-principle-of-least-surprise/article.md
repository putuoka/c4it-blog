---
title: "Clean code tip: Principle of Least Surprise"
path: "/cleancodetips/principle-of-least-surprise"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.jpg"
excerpt: "The Principle of Least Surprise is a simple principle that helps you writing clear, obvious code: this helps other developers foresee what a component does without worrying of unexpected behaviors."
created: 2021-06-22
updated: 2021-06-22
---

The **Principle of least surprise**, also called **Principle of least astonishment** is a quite simple principle about Software design with some interesting aspects.

Simplifying it a log, this principle says that:

> A function or class should do the most obvious thing you can expect from its name

Let's start with an example of what _not to_ do:

```cs
string Concatenate(string firstString, string secondString)
{
  return string.Concat(firstString, secondString).ToLowerInvariant();
}
```

What is the problem with this method? Well, simply, the Client may expect to receive the strings concatenated without other modifications; but internally, the function calls the `ToLowerInvariant()` method on the returned string, thus modifying the expected behavior.

So, when calling

```cs
var first ="Abra";
var second = "Kadabra";

var concatenated = Concatenate(first, second);
```

The `concatenated` variable will be _abrakadabra_ instead of _AbraKadabra_.

The solution is really simple: **use better names**!

```cs
string ConcatenateInLowerCase(string firstString, string secondString)
{
  return string.Concat(firstString, secondString).ToLowerInvariant();
}
```

Functions should do what you expect them to do: **use clear names, clear variables, good return types**.

Related to this principle, **you should not introduce unexpected side effects**.

As an example, let's store some data on a DB, and wrap the database access with a Repository class. And let's add an `InsertItem` method.

```cs
public void InsertItem(Item newItem)
{
  if(repo.Exists(newItem))
    repo.Update(newItem);
  else
    repo.Add(newItem);
}
```

Clearly, the client does not expect this method to replace an existing item. Again, the solution is to give it a better name: `InsertOrUpdate`, or `Upsert`.

Lastly, **the function should use the Design Pattern suggested by its name**.

```cs
public class RepositoryFactory
{
    private static Repository instance = null;
    public static Repository Instance
    {
        get {
                if (instance == null) {
                    instance = new Repository();
                }
                return instance;
        }
    }
}
```

See the point? It looks like we are using the Factory design pattern, but the code is actually the one for a Singleton.

Again, **being clear and obvious** is one of the keys to successful clean code.

The solution? **Use better names**! It may not be simple, but luckily [there are some simple](./01-choose-meaningful-names "Clean code tip: How to choose meaningful names?") guidelines that you can follow.

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1337454097616822274) or on the comment section below!

🐧
