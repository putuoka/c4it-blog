---
title: "PriorityQueues on .NET 7 and C# 11"
path: "/blog/intro-priority-queue"
tags: ["dotNET", "MainArticle"]
featuredImage: "./cover.png"
excerpt: "A PriorityQueue represents a collection of items that have a value and a priority. Now this data structure is built-in in dotNET!"
created: 2022-12-12
updated: 2022-12-12
---

Starting from .NET 6 and C# 10, we finally have built-in support for PriorityQueues 🥳

A PriorityQueue is a collection of items that have a value and a priority; as you can imagine, they act as a queue: the main operations are "add an item to the queue", called _Enqueue_, and "remove an item from the queue", named _Dequeue_. The main difference from a simple Queue is that on dequeue, the item with **lowest priority** is removed.

In this article, we're gonna use a `PriorityQueue` and wrap it into a custom class to solve one of its design issues (that I hope they'll be addressed in a future release of dotNET).

## Welcoming Priority Queues in .NET

Defining a priority queue is straightforward: you just have to declare it specifying the type of items and the type of priority.

So, if you need a collection of `Child` items, and you want to use `int` as a priority type, you can define it as

```cs
PriorityQueue<Child, int> pq = new PriorityQueue<Child, int>();
```

Now you can add items using the `Enqueue` method:

```cs
Child child = //something;
int priority = 3;
queue.Enqueue(child, priority);
```

And you can retrieve the one on the top of the queue by calling `Peek()`, if you want to just look at the first item without removing it from the queue:

```cs
Child child3 = BuildChild3();
Child child2 = BuildChild2();
Child child1 = BuildChild1();

queue.Enqueue(child3, 3);
queue.Enqueue(child1, 1);
queue.Enqueue(child2, 2);

//queue.Count = 3

Child first = queue.Peek();
//first will be child1, because its priority is 1
//queue.Count = 3, because we did not remove the item on top
```

or `Dequeue` if you want to retrieve it while removing it from the queue:

```cs
Child child3 = BuildChild3();
Child child2 = BuildChild2();
Child child1 = BuildChild1();

queue.Enqueue(child3, 3);
queue.Enqueue(child1, 1);
queue.Enqueue(child2, 2);

//queue.Count = 3

Child first = queue.Dequeue();
//first will be child1, because its priority is 1
//queue.Count = 2, because we removed the item with the lower priority
```

This is the essence of a Priority Queue: insert items, give them a priority, then remove them starting from the one with lower priority.

## Creating a Wrapper to automatically handle priority in Priority Queues

There's a problem with this definition: you have to manually specify the priority of each item.

I don't like it that much: I'd like to automatically assign each item a priority. So we have to wrap it in another class.

Since we're near Christmas, and this article is part of the C# Advent 2022, let's use an XMAS-themed example: a Christmas list used by Santa to handle gifts for children.

Let's assume that the Child class has this shape:

```cs
public class Child
{
    public bool HasSiblings { get; set; }
    public int Age { get; set; }
    public List<Deed> Deeds { get; set; }
}

public abstract class Deed
{
    public string What { get; set; }
}

public class GoodDeed : Deed
{ }

public class BadDeed : Deed
{ }
```

Now we can create a Priority Queue of type `<Child, int>`:

```cs
PriorityQueue<Child, int> pq = new PriorityQueue<Child, int>();
```

And wrap it all within a `ChristmasList` class:

```cs
public class ChristmasList
{
    private readonly PriorityQueue<Child, int> queue;

    public ChristmasList()
    {
        queue = new PriorityQueue<Child, int>();
    }

    public void Add(Child child)
    {
        int priority =// ??;
        queue.Enqueue(child, priority);
    }

     public Child Get()
    {
        return queue.Dequeue();
    }
}
```

> A question for you: what happens when we call the `Get` method on an empty queue? What should we do instead? Drop a message below! 📩

We need to define a way to assign each child a priority.

### Define priority as private behavior

The easiest way is to calculate the priority within the Add method: define a function that accepts a `Child` and returns an `int`, and then pass that `int` value to the `Enqueue` method.

```cs
public void Add(Child child)
{
    int priority = GetPriority(child);
    queue.Enqueue(child, priority);
}
```

This approach is useful because you're encapsulating the behavior in the `ChristmasList` class, but has the downside that it's not extensible, and you cannot use different priority algorithms in different places of your application. On the other side, GetPriority is a private operation within the `ChristmasList` class, so it can be fine for our example.

### Pass priority calculation from outside

We can then pass a `Func<Child, int>` in the `ChristmasList` constructor, centralizing the priority definition and giving the caller the responsibility to define it:

```cs
public class ChristmasList
{
    private readonly PriorityQueue<Child, int> queue;
    private readonly Func<Child, int> _priorityCalculation;

    public ChristmasList(Func<Child, int> priorityCalculation)
    {
        queue = new PriorityQueue<Child, int>();
        _priorityCalculation = priorityCalculation;
    }


    public void Add(Child child)
    {
        int priority = _priorityCalculation(child);
        queue.Enqueue(child, priority);
    }

     public Child Get()
    {
        return queue.Dequeue();
    }
}
```

This implementation presents the opposite problems and solutions we saw in the previous example.

## What I'd like to see in the future

This is a personal thought: it'd be great if we had a slightly different definition of PriorityQueue to automate the priority definition.

One idea could be to add in the constructor a parameter that we can use to calculate the priority, just to avoid specifying it explicitly. So, I'd expect that the current definition of the constructor and of the Enqueue method change from this:

```cs
PriorityQueue<Child, int> pq = new PriorityQueue<Child, int>();

int priority = _priorityCalculation(child);
queue.Enqueue(child, priority);
```

to this:

```cs
PriorityQueue<Child, int> pq = new PriorityQueue<Child, int>(_priorityCalculation);

queue.Enqueue(child);
```

It's not perfect, and it raises some new problems.

Another way could be to force the item type to implement an interface that exposes a way to retrieve its priority, such as

```cs
public interface IHavePriority<T>{
    public T GetPriority();
}

public class Child : IHavePriority<int>{}
```

Again, this approach is not perfect but can be helpful.

Talking about its design, **which approach would you suggest, and why?**

## Further readings

As usual, the best way to learn about something is by reading its official documentation:

🔗 [PriorityQueue documentation | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.priorityqueue-2)

This article is part of the 2022 C# Advent (that's why I chose a Christmas-ish topic for this article),

🔗 [C# Advent Calendar 2022](https://csadvent.christmas/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Conclusion

PriorityQueue is a good-to-know functionality that is now out-of-the-box in dotNET. Do you like its design? Have you used another library to achieve the same result? In what do they differ?

Let me know in the comments section! 📩

For now, happy coding!

🐧
