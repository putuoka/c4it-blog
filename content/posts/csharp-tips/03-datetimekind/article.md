---
title: "C# tip: create correct DateTimes with DateTimeKind"
path: '/csharptips/datetimekind'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.jpg"
excerpt : "Creating simple DateTimes creates issues when handling timezones. You can solve some issues by using DateTimeKind"
created: 2021-08-10
updated: 2021-08-10
---

One of the most common issues we face when developing applications is handling dates, times, and time zones.

Let's say that we need the date for January 1st, 2020, exactly 30 minutes after midnight. We would be tempted to do something like:

```cs
var plainDate = new DateTime(2020, 1, 1, 0, 30, 0);
```

It makes sense. And `plainDate.ToString()` returns _2020/1/1 0:30:00_, which is correct.

But, as I explained [in a previous article](./5-things-datetime-timezones-and-formatting "5 things about DateTime time zones and formatting | Code4IT"), while `ToString` does not care about time zone, when you use `ToUniversalTime` and `ToLocalTime`, the results differ, according to your time zone.

Let's use a real example. _Please, note that I live in UTC+1, so pay attention to what happens to the hour!_

```cs
var plainDate = new DateTime(2020, 1, 1, 0, 30, 0);

Console.WriteLine(plainDate);  // 2020-01-01 00:30:00
Console.WriteLine(plainDate.ToUniversalTime());  // 2019-12-31 23:30:00
Console.WriteLine(plainDate.ToLocalTime());  // 2020-01-01 01:30:00
```

This means that `ToUniversalTime` considers `plainDate` as Local, so, in my case, it subtracts 1 hour.
On the contrary, `ToLocalTime` considers `plainDate` as UTC, so it adds one hour.

So what to do?

__Always specify the `DateTimeKind` parameter__ when creating `DateTime`s__. This helps the application understanding which kind of date is it managing.

```cs
var specificDate = new DateTime(2020, 1, 1, 0, 30, 0, DateTimeKind.Utc);

Console.WriteLine(specificDate); //2020-01-01 00:30:00
Console.WriteLine(specificDate.ToUniversalTime()); //2020-01-01 00:30:00
Console.WriteLine(specificDate.ToLocalTime()); //2020-01-01 00:30:00
```

As you see, it's always the same date.

Ah, right! DateTimeKind has only 3 possible values:

```cs
public enum DateTimeKind
{
    Unspecified,
    Utc,
    Local
}
```

So, my suggestion is to always specify the `DateTimeKind` parameter when creating a new DateTime.

If you want to know more about Time and Timezones, I'd suggest watching [this YouTube video by Computerphile](https://www.youtube.com/watch?v=-5wpm-gesOY "The Problem with Time & Timezones - Computerphile").


👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1338540757943119874 "Original tweet on Twitter") or on the comment section below.

🐧