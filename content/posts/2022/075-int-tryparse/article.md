---
title: "Advanced parsing using Int.TryParse in C#"
path: "/blog/advanced-int-tryparse"
tags: ["CSharp", "MainArticle"]
featuredImage: "./cover.png"
excerpt: "We all need to parse strings as integers. Most of the time, we use int.TryParse(string, out int). But there's a more advanced overload that we can use for complex parsing."
created: 2022-03-15
updated: 2022-03-15
---

You have probably used the `int.TryParse` method with this signature:

```cs
public static bool TryParse (string? s, out int result);
```

That C# method accepts a string, `s`, which, if it can be parsed, will be converted to an `int` value and whose integer value will be stored in the `result` parameter; at the same time, the method returns `true` to notify that the parsing was successful.

As an example, this snippet:

```cs
if (int.TryParse("100", out int result))
{
    Console.WriteLine(result + 2); // correctly parsed as an integer
}
else
{
    Console.WriteLine("Failed");
}
```

prints _102_.

Does it work? Yes. Is this the best we can do? No!

## How to parse complex strings with int.TryParse

What if you wanted to parse _100€_? There is a less-known overload that does the job:

```cs
public static bool TryParse (
    string? s,
    System.Globalization.NumberStyles style,
    IFormatProvider? provider,
    out int result);
```

As you see, we have two more parameters: `style` and `provider`.

`IFormatProvider? provider` allows you to specify the culture information: examples are `CultureInfo.InvariantCulture` and `new CultureInfo("es-es")`.

But the real king of this overload is the `style` parameter: it is a [Flagged Enum](https://www.code4it.dev/blog/5-things-enums-csharp#4-flagged-enums "5 things you should know about enums in C#") which allows you to specify the expected string format.

`style` is of type `System.Globalization.NumberStyles`, which has several values:

```cs
[Flags]
public enum NumberStyles
{
    None = 0x0,
    AllowLeadingWhite = 0x1,
    AllowTrailingWhite = 0x2,
    AllowLeadingSign = 0x4,
    AllowTrailingSign = 0x8,
    AllowParentheses = 0x10,
    AllowDecimalPoint = 0x20,
    AllowThousands = 0x40,
    AllowExponent = 0x80,
    AllowCurrencySymbol = 0x100,
    AllowHexSpecifier = 0x200,
    Integer = 0x7,
    HexNumber = 0x203,
    Number = 0x6F,
    Float = 0xA7,
    Currency = 0x17F,
    Any = 0x1FF
}
```

You can combine those values with the `|` symbol.

Let's see some examples.

### Parse as integer

The simplest example is to parse a simple integer:

```cs
[Fact]
void CanParseInteger()
{
    NumberStyles style = NumberStyles.Integer;
    var canParse = int.TryParse("100", style, new CultureInfo("it-it"), out int result);

    Assert.True(canParse);
    Assert.Equal(100, result);
}
```

Notice the `NumberStyles style = NumberStyles.Integer;`, used as a baseline.

### Parse parenthesis as negative numbers

In some cases, parenthesis around a number indicates that the number is negative. So _(100)_ is another way of writing _-100_.

In this case, you can use the `NumberStyles.AllowParentheses` flag.

```cs
[Fact]
void ParseParenthesisAsNegativeNumber()
{
    NumberStyles style = NumberStyles.Integer | NumberStyles.AllowParentheses;
    var canParse = int.TryParse("(100)", style, new CultureInfo("it-it"), out int result);

    Assert.True(canParse);
    Assert.Equal(-100, result);
}
```

### Parse with currency

And if the string represents a currency? You can use `NumberStyles.AllowCurrencySymbol`.

```cs
[Fact]
void ParseNumberAsCurrency()
{
    NumberStyles style = NumberStyles.Integer | NumberStyles.AllowCurrencySymbol;
    var canParse = int.TryParse(
"100€",
 style,
 new CultureInfo("it-it"),
out int result);

    Assert.True(canParse);
    Assert.Equal(100, result);
}
```

But, remember: the only valid symbol is the one related to the `CultureInfo` instance you are passing to the method.

Both

```cs
var canParse = int.TryParse(
    "100€",
    style,
    new CultureInfo("en-gb"),
    out int result);
```

and

```cs
var canParse = int.TryParse(
    "100$",
    style,
    new CultureInfo("it-it"),
    out int result);
```

are not valid. One because we are using English culture to parse Euros, the other because we are using Italian culture to parse Dollars.

**Hint: how to get the currency symbol given a CultureInfo?** You can use `NumberFormat.CurrecySymbol`, like this:

```cs
new CultureInfo("it-it").NumberFormat.CurrencySymbol; // €
```

### Parse with thousands separator

And what to do when the string contains the separator for thousands? _10.000_ is a valid number, in the Italian notation.

Well, you can specify the `NumberStyles.AllowThousands` flag.

```cs
[Fact]
void ParseThousands()
{
    NumberStyles style = NumberStyles.Integer | NumberStyles.AllowThousands;
    var canParse = int.TryParse("10.000", style, new CultureInfo("it-it"), out int result);

    Assert.True(canParse);
    Assert.Equal(10000, result);
}
```

### Parse hexadecimal values

It's a rare case, but it may happen: you receive a string in the Hexadecimal notation, but you need to parse it as an integer.

In this case, `NumberStyles.AllowHexSpecifier` is the correct flag.

```cs
[Fact]
void ParseHexValue()
{
    NumberStyles style = NumberStyles.AllowHexSpecifier;
    var canParse = int.TryParse("F", style, new CultureInfo("it-it"), out int result);

    Assert.True(canParse);
    Assert.Equal(15, result);
}
```

Notice that the input string **does not contain the Hexadecimal prefix**.

## Use multiple flags

You can compose multiple Flagged Enums to create a new value that represents the union of the specified values.

We can use this capability to parse, for example, a currency that contains the thousands separator:

```cs
[Fact]
void ParseThousandsCurrency()
{
    NumberStyles style =
NumberStyles.Integer
| NumberStyles.AllowThousands
| NumberStyles.AllowCurrencySymbol;

    var canParse = int.TryParse("10.000€", style, new CultureInfo("it-it"), out int result);

    Assert.True(canParse);
    Assert.Equal(10000, result);
}
```

`NumberStyles.AllowThousands | NumberStyles.AllowCurrencySymbol` does the trick.

## Conclusion

We all use the simple `int.TryParse` method, but when parsing the input string requires more complex calculations, we can rely on those overloads. Of course, if it's still not enough, you should create your custom parsers (or, as a simpler approach, you can use regular expressions).

Are there any methods that have overloads that nobody uses? Share them in the comments!

Happy coding!

🐧
