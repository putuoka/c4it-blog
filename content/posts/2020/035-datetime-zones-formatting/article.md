---
title: "5 things about DateTime time zones and formatting"
path: "/blog/5-things-datetime-timezones-and-formatting"
tags: ["CSharp"]
featuredImage: "./cover.jpg"
excerpt:  "You're using DateTime.Now, aren't you? Be careful, because it may bring some troubles to your application. Here I'll explain why and I'll talk about time zones and formatting in C# DateTime."
created: 2020-07-28
updated: 2020-07-28
---


Working with dates, if not done carefully, can bring to bugs that can impact your systems. You must always take care of time zones and use the best formatting practices, or else you'll get some trouble.

Since I'll talk about time zones, keep in mind that, since I live in Italy, my local time is UTC+2: this means that 5 AM UTC means 7 AM Italian time.

## #1: Building a DateTime with the right time zone

Do you use `DateTime.Now` to get the current date and time? If yes, remember that you are getting the __local time__: this may cause trouble when exchanging dates with different systems and time zones. Rather, you should use `DateTime.UtcNow`.

```cs
var d = DateTime.Now;
Console.WriteLine(d.ToString()); // 02-Jun-20 19:55:16
Console.WriteLine(d.ToUniversalTime()); // 02-Jun-20 17:55:16
Console.WriteLine(d.ToLocalTime()); // 02-Jun-20 19:55:16
```

Also, pay attention when you are defining a DateTime object using __the constructor: by default, it refers to an unspecified time zone.__

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16);
Console.WriteLine(d.ToString()); // 02-Jun-20 15:55:16
Console.WriteLine(d.ToUniversalTime()); // 02-Jun-20 13:55:16
Console.WriteLine(d.ToLocalTime()); // 02-Jun-20 17:55:16
```

Have you noticed that the three string results have different values for the time?

That's why you should consider using a different constructor: `public DateTime (int year, int month, int day, int hour, int minute, int second, DateTimeKind kind)`.

_DateTimeKind_ is an enum with 3 values: __Utc, Unspecified and Local__: Utc and Local have a clear meaning, I don't have to explain them.

In these case you can add the `DateTimeKind` flag to the constructor and set it to _Utc_:

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);
Console.WriteLine(d.ToString()); // 02-Jun-20 15:55:16
Console.WriteLine(d.ToUniversalTime()); // 02-Jun-20 15:55:16
Console.WriteLine(d.ToLocalTime()); // 02-Jun-20 17:55:16
```

or to _Local_:

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Local);
Console.WriteLine(d.ToString()); // 02-Jun-20 15:55:16
Console.WriteLine(d.ToUniversalTime()); // 02-Jun-20 13:55:16
Console.WriteLine(d.ToLocalTime()); // 02-Jun-20 15:55:16
```

_Unspecified_ has a weird meaning: if you are trying to get the UTC time, it considers the date as a local date; on the contrary, when you call the ToLocalTime it considers the time as UTC.

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Unspecified);
Console.WriteLine(d.ToString()); // 02-Jun-20 15:55:16
Console.WriteLine(d.ToUniversalTime()); // 02-Jun-20 13:55:16
Console.WriteLine(d.ToLocalTime()); // 02-Jun-20 17:55:16
```

So, in the previous example, I set the hour value to 15, which, when converted to UTC, is transformed to 13, and when converted to Local is transformed to 17. As you've already seen, Unspecified is the default value on the constructor. So, __you should consider adding the DateTimeKind.Utc__ flag on your code.

> Who cares about time zones, I'm only interested in the date part, I don't care about the time!

Apparently you're right, but here's an example that will change your mind:

```cs
var d = new DateTime(2020,1,1);
Console.WriteLine (d.ToLocalTime()); // 01-Jan-20 01:00:00
Console.WriteLine (d.ToUniversalTime()); // 31-Dec-19 23:00:00
```

## #2: Format shorthands and localization

Now you have your Date. It's time to convert it as a string for your users. As you know, you can format every part of the date: for this topic, you can refer directly to [the official documentation](https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings "Date and time formats documentation").

Usually, you'll see something like this:

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);
Console.WriteLine(d.ToString("yyyy-MM-dd HH:mm:ss")); // 2020-06-02 15:55:16
Console.WriteLine(d.ToString("yyyy-MMMM-dd hh:mm:ss")); // 2020-June-02 03:55:16
```

Notice how the difference of the result with _MMMM_ instead of _MM_ and _hh_ instead of _HH_.

Also, you can use predefined formats if you are interested only in the time or the date part of the object:

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);

Console.WriteLine(d.ToLongDateString()); // Wednesday, June 2, 2020
Console.WriteLine(d.ToLongTimeString()); // 15:55:16
```

Those two methods internally call the formatter, using, respectively, _D_ and _T_ as format. It's a shortcut, you just don't have to remember the formatting flag. But it has a downside: __DateTime.ToLongDateString and DateTime.ToLongTimeString don't allow you to specify the culture__. So, if you want to get the date in Italian, you'd better use this:

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);

var cultureInfo = new CultureInfo("it-IT");
Console.WriteLine(d.ToString("D", cultureInfo)); // mercoledì 2 giugno 2020
```

Actually, the second parameter of ToString is not a CultureInfo object, but any class that implements the _IFormatProvider_ interface. So you can create your own formatter. Maybe your client is a Klingon and needs his own format? 😉

## #3: Defining a custom Culture

If you need very specific date formats, you can create your own Culture.
As far as I know, you can't create a new culture from scratch, but you can customize an existing one.

You can do many things, such as customizing date and time separators and even define your own names for weekdays and months using the [Klingon dictionary](http://klingon.wiki/En/Weekdays "Klingon dictionary for weekdays"):

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);

CultureInfo klingonCulture = new CultureInfo("en-US");
DateTimeFormatInfo dtfi = klingonCulture.DateTimeFormat;
dtfi.DayNames = new string[] { "lojmItjaj", "DaSjaj", "povjaj", "ghItlhjaj", "loghjaj", "buqjaj", "ghInjaj" };

Console.WriteLine(d.ToString("dddd", klingonCulture)); // povjaj
```

Probably you'll never use this functionality since most of the use cases are already defined by default by .NET. But it's interesting to know that you have the possibility to heavily customize date formats.

## #4: Getting timezone info

> Well, I really don't care about the date! I just need the timezone info!

You could get the UTC time, the Local time, and then calculate the difference.

Or you can use the __zz__ and __zzzz__ date formats:

```cs
var d = new DateTime(2021, 6, 2, 15, 55, 16);

Console.WriteLine(d.ToString("zz")); // +02
Console.WriteLine(d.ToString("zzzz")); // +02:00
```

Easy, right? This method ignores all the info related to the local culture and the DateTimeKind, so you don't have to worry about them.

## #5: A good way to store DateTimes

It's time to store date info somewhere and have it available across multiple systems.
The first option is to store the absolute number of milliseconds. Calculate the difference between your date and `DateTime.MinValue` (which is  01-Jan-01 00:00:00) and store milliseconds.

More simply, use the __o__ or the __O__ formatter to get all the information you need. This is called __round-trip formatter__ because it allows you to store and parse the result without loss of information.

```cs
var d = new DateTime(2020, 6, 2, 15, 55, 16, DateTimeKind.Utc);

var formattedDate = d.ToString("O"); // 2020-06-02T15:55:16.0000000Z
var d1 = DateTime.ParseExact(formattedDate, "O", CultureInfo.CurrentCulture);
Console.WriteLine(d1 == d); // True
```

Again, you can refer to the [Microsoft documentation](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#the-round-trip-o-o-format-specifier "Round-trip format documentation on Microsoft site").

## Wrapping up

Here we've seen some things to consider when working with DateTimes, time zones and formatting:

1. Remember to work with UTC dates, in order to avoid timezones issues
2. You can create your own date formatters and use them in the ToString method
3. If you only need info about the timezone, you can rely on the _z_ format
4. When you need to store DateTime info as a string, you should use the _O_ format.

Happy coding!
