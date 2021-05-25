---
title: "How to use String.Format - and why you should care about it"
path: "/blog/how-to-use-string-format"
tags: ["CSharp"]
featuredImage: "./cover.jpg"
excerpt:  "Is string.Format obsolete? Not at all, it still has cards to play! Let's see how we can customize format and create custom formatters."
created: 2020-12-01
updated: 2020-12-01
---

Formatting strings is one of the basic operations we do in our day-by-day job. Many times we create methods to provide specific formatting for our data, but not always we want to implement additional methods for every type of formatting we need - too many similar methods will clutter our code.

Let's say that you have this simple class:

```cs
class CapturedPokemon{
  public string Name { get; set; }
  public int PokedexIndex { get; set; }
  public decimal Weight { get; set; }
  public decimal Height { get; set; }
  public DateTime CaptureDate { get; set; }
}
```

and an instance of that class:

```cs
var pkm = new CapturedPokemon
{
    Name = "Garchomp",
    PokedexIndex = 445,
    Height = 1.9m,
    Weight = 95.0m,
    CaptureDate = new DateTime(2020, 5, 6, 14, 55, 23)
};
```

How can we format the `pkm` variable to provide useful information on our UI?

The most simple ways are using _concatenation_, _formatting_, or _string interpolation_.

## Differences between concatenation, formatting, and interpolation

__Concatenation__ is the simplest way: you concatenate strings with the `+` operator.

```cs
var messageWithConcatenation= "I caught a " + pkm.Name + " on " + pkm.CaptureDate.ToString("yyyy-MM-dd");
```

There are 2 main downsides: 

1. it's hard to read and maintains, with all those open and closed quotes
2. it's highly inefficient, since __strings are immutable__ and, every time you concatenate a string, it creates a whole new string.

__Interpolation__ is the ability to _wrap_ a variable inside a string and, eventually, call methods on it while creating the string itself.

```cs
var messageWithInterpolation = $"I caught a {pkm.Name} on {pkm.CaptureDate.ToString("yyyy-MM-dd")}";
```

As you see, it's easier to read than simple concatenation.

The downside of this approach is that here you don't have a visual understanding of what is the expected string, because the variables drive your attention away from the message you are building with this string.

_PS: notice the `$` at the beginning of the string and the `{` and `}` used to interpolate the values._

__Formatting__ is the way to define a string using positional placeholders.

```cs
var messageWithFormatting = String.Format("I caught a {0} on {1}", pkm.Name, pkm.CaptureDate.ToString("yyyy-MM-dd"));
```

We are using the `Format` static method from the `String` class to define a message, set up the position of the elements and the elements themselves.

Now we have a visual clue of the general structure of the string, but we don't have a hint of which values we can expect.

Even if `string.Format` is considered obsolete, there is still a reason to consider it when formatting strings: this class can help you format the values with default and custom formatters.

But first, a quick note on the positioning.

## Positioning and possible errors in String.Format

As you may expect, for `string.Format` positioning is _0-based_. But if it's true that the numbers must start with zero, it's also true that the actual position doesn't count. In fact, the next two strings are the same:

```cs
var m1 = String.Format("I caught a {0} on {1}", pkm.Name, pkm.CaptureDate);
var m2 = String.Format("I caught a {1} on {0}", pkm.CaptureDate, pkm.Name);
```

Of course, if you swap the positioning in the string, you must also swap the order of the parameters.

Since we are only specifying the position, __we can use the same value multiple times__ inside the same string, just by repeating the placeholder:

```cs
String.Format("I caught a {0} (YES, {0}!) on {1}", pkm.Name, pkm.CaptureDate);
// I caught a Garchomp (YES, Garchomp!) on 06/05/2020 14:55:23
```

What happens if the number of position is different from the number of arguments?

If there are _more parameters than placeholders_, the exceeding ones are simply ignored:

```cs
String.Format("I caught a {0} on {1}", pkm.Name, pkm.CaptureDate, pkm.PokedexIndex);
/// I caught a Garchomp on 06/05/2020 14:55:23
```

On the contrary, if there are _more placeholders than parameters_, we will get a `FormatException`:

```cs
String.Format("I caught a {0} on {1}", pkm.Name);
```

with the message

> Index (zero based) must be greater than or equal to zero and less than the size of the argument list_.

## How to format numbers

You can print numbers with lots of different formats, you know. Probably you've already done it with the `ToString` method. Well, here's almost the same.

You can use all the [standard numeric formats](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings "Standard numeric format strings documentation") as formatting parameters.

For example, you can __write a decimal as a currency__ value by using `C` or `c`:

```cs
String.Format("{0:C}", 12.7885m);
// £12.79
```

In this way, you can use the symbols __belonging to the current culture__ (in this case, we can see the `£`) and __round the value__ to the second decimal.

If you want to change the current culture, you must setup it in a global way or, at least, __change the culture for the current thread__:

```cs
Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("it-IT");

Console.WriteLine(String.Format("{0:C}", 12.7885m)); // 12,79 €
```

If you want to handle numbers with different formats, you can all the formats defined in the official documentation (linked above). Among them we can find, for example, the _fixed-point_ formatter that can manage both the sign and the number of decimal digits:

```cs
String.Format("{0:f8}", 12.7885m) //12.78850000
```

With `:f8` here we are saying that we want the _fixed-point_ format with 8 decimal digits.

## How to format dates

As per numbers, the default representation of dates is the one provided by the `ToString` method.

```cs
String.Format("{0}", new System.DateTime(2020,5,8,1,6,0))
// 08/05/2020 01:06:00
```

This is useful, but not very customizable.
Luckily we can use our usual formatting strings to print the date as we want. 

For example, if you want to print only the date, you can use `:d` in the formatting section:

```cs
String.Format("{0:d}", new System.DateTime(2020,5,8,1,6,0))
// 08/05/2020
```

and you can use `:t` if you are interested only in the time info:

```cs
String.Format("{0:t}", new System.DateTime(2020,5,8,1,6,0))
// 01:06
```

Of course, you can define your custom formatting to get the info in the format you want:

```cs
String.Format("{0:yyyy-MM-dd hh:mm}", new System.DateTime(2020,5,8,1,6,0))
// 2020-05-08 01:06
```

_PSS! [Remember how the current culture impacts the result!](./5-things-datetime-timezones-and-formatting#2-format-shorthands-and-localization "5 things about DateTime time zones and formatting - Format shorthands and localization")_

## How to define custom formats

As you may imagine, the default value used for formatting is the one defined by `ToString`. We can prove it by simply defining the `ToString` method in our `CapturedPokemon` class

```cs
class CapturedPokemon
{
  // fields...

  public override string ToString()
  {
    return $"Name: {Name} (#{PokedexIndex})";
  }
}
```

and by passing the whole `pkm` variable defined at the beginning of this article:

```cs
String.Format("{0}", pkm)
// Name: Garchomp (#445)
```

But, of course, you may want to use different formatting across your project.

Let's define a formatter for my `CapturedPokemon` class. This class must implement both `IFormatProvider` and `ICustomFormatter` interfaces.

```cs
public class PokemonFormatter : IFormatProvider, ICustomFormatter
{
  // todo
}
```

First of all, let's implement the `GetFormat` method from `IFormatProvider` with the default code that works for every custom formatter we are going to build:

```cs
public object GetFormat(Type formatType)
{
  if (formatType == typeof(ICustomFormatter))
    return this;
  else
    return null;
}
```

And then we can define the core of our formatter in the `Format` method. It accepts 3 parameters: `format` is the string that we pass after the `:` symbol, like in `:d3`; `arg` is a generic `object` that references the object to be formatted and `formatProvider` is... well, __I don't know!__ Drop me a comment if you know how to use it and why!

Moving on, and skipping the initial checks, we can write the core of the formatting like this:

```cs
switch (format.ToUpper())
{
  case "FULL": return $"{pokemon.Name} (#{pokemon.PokedexIndex}) caught on {pokemon.CaptureDate}";
  case "POKEDEX": return $"{pokemon.Name} (#{pokemon.PokedexIndex})";
  case "NAME": return $"{shortName}";
  default:
    throw new FormatException($"The format {format} is not valid");
}
```

So the point is to define different formats, pass one of them in the `format` parameter, and apply it to the `arg` object.

We can then use the `String.Format` method in this way:

```cs
String.Format(new PokemonFormatter(), "{0:full}", pkm) // Garchomp (#445) caught on 06/05/2020 14:55:23
String.Format(new PokemonFormatter(), "{0:pokedex}", pkm) // Garchomp (#445)
String.Format(new PokemonFormatter(), "{0:name}", pkm) //Grchmp
```

If you are interested in the whole code, have find it at the end of the article.

By the way, why should we care about formatters? Because we must always take into account the __separation of concerns__. Why would the `CapturedPokemon` class expose a method for each formatting value? It should be in the scope of the class definition itself, so it's better to write it somewhere else and use it only when it's needed.

## Conclusion

Using `String.Format` is now considered a _vintage_ way to format strings. Even Microsoft itself recommends to use _string interpolation_ because it is more readable (syntax highlighting helps you see better what are the values) and more flexible (because you directly create the string instead of calling an additional method - string.Format itself).

By the way, I think it's important to get to know even `String.Format` because it can be useful not only for readability (because you can see the structure of the returned string even without looking at the actual parameters used) but also because you can create strings dynamically, like in this example:

```cs
string en = "My name is {0}";
string it = "Il mio nome è {0}";

var actualString = DateTime.UtcNow.Ticks % 2 == 0 ? it : en;

Console.WriteLine(string.Format(actualString, "Davide"));
```

If you want to read more about `string.Format`, just head to the [Microsoft documentation](https://docs.microsoft.com/en-us/dotnet/api/system.string.format?view=netcore-3.1#get-started-with-the-stringformat-method "Get started with the String.Format method by Microsoft Docs"), where you can find lots of examples.

In the end, here's the full code of the `Format` method for our `PokemonFormatter` class.

```cs
public string Format(string format, object arg, IFormatProvider formatProvider)
{
  if (!this.Equals(formatProvider)) { return null; }

  if (!(arg is CapturedPokemon pokemon)) { return null; }

  if (string.IsNullOrWhiteSpace(format))
    format = "full";

  var shortName = Regex.Replace(pokemon.Name, "a|e|i|o|u", "");

  switch (format.ToUpper())
  {
    case "FULL": return $"{pokemon.Name} (#{pokemon.PokedexIndex}) caught on {pokemon.CaptureDate}";
    case "POKEDEX": return $"{pokemon.Name} (#{pokemon.PokedexIndex})";
    case "NAME": return $"{shortName}";
    default:
      throw new FormatException($"The format {format} is not valid");
  }
}
```

Happy coding!
