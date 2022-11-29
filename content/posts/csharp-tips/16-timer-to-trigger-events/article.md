---
title: "C# Tip: Raise synchronous events using Timer (and not a While loop)"
path: "/csharptips/timer-to-trigger-synchronous-events"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "When you need to fire synchronous events, don't use a while(true) loop: use a Timer!"
created: 2022-11-29
updated: 2022-11-29
---

There may be times when you need to process a specific task on a timely basis, such as **polling an endpoint** to look for updates or refreshing a Refresh Token.

If you need infinite processing, you can pick two roads: the obvious one or the better one.

For instance, you can use an infinite loop and put a Sleep command to delay the execution of the next task:

```cs
while(true)
{
    Thread.Sleep(2000);
    Console.WriteLine("Hello, Davide!");
}
```

There's nothing wrong with it - but we can do better.

## Introducing System.Timers.Timer

The `System.Timers` namespace exposes a cool object that you can use to achieve that result: `Timer`.

You then define the timer, choose which event(s) must be processed, and then run it:

```cs
void Main()
{
    System.Timers.Timer timer = new System.Timers.Timer(2000);
    timer.Elapsed += AlertMe;
    timer.Elapsed += AlertMe2;
    
    timer.Start();
}

void AlertMe(object sender, ElapsedEventArgs e)
{
    Console.WriteLine("Ciao Davide!");
}

void AlertMe2(object sender, ElapsedEventArgs e)
{
    Console.WriteLine("Hello Davide!");
}
```

The constructor accepts in input an interval (a `double` value that represents the **milliseconds** for the interval), whose default value is 100.

This class implements `IDisposable`: if you're using it as a dependency of another component that must be `Dispose`d, don't forget to call `Dispose` on that Timer.

**Note:** use this only for synchronous tasks: there are other kinds of Timers that you can use for asynchronous operations, such as `PeriodicTimer`, which also can be stopped by canceling a `CancellationToken`.

*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*


Happy coding!

🐧
