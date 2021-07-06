---
title: "How to check if a string is really empty with C#"
path: "/blog/csharp-check-if-string-is-empty"
tags: ['CSharp'] 
featuredImage: "./cover.jpg"
excerpt: "Is a string empty? What if it contains only white spaces? You shouldn't reinvent the wheel, since .NET exposes methods exactly for these cases: String.IsNullOrEmpty and String.IsNullOrWhiteSpace."
created: 2018-10-01
updated: 2018-10-01
---

> To be, or not to be (empty), that is the question...

That's a simple, yet complex, question.

First of all, when a string is not empty? For me, when there is at least one character or one number.

## Do it from scratch

Let's create a custom function to achieve this functionality.

```cs
public static bool IsStringEmpty(string myString){
// do something
}
```

Ok, now we have to think of how to check if the string `myString` is empty.

Of course, the string must be not null. And must not be empty. Maybe... its length must be greater than zero?

```cs
public static bool IsStringEmpty(string myString){

return myString==null || myString == String.Empty || myString.Length == 0;
}
```

Ok, we should be fine. But, what if the string contains only whitespaces?

I mean, the string `"     "`, passed to the `IsStringEmpty` method, will return true.

If that's not what we want, we should include this check on the method.  
Of course, this implies a bit of complexity to check null values.

```cs
public static bool IsStringEmpty(string myString){

return myString==null || myString == String.Empty || myString.Length == 0 || myString.Trim().Length == 0 ;
}
```

Ok, we covered the most important scenarios.

So we can try the method with our values:

```cs
using System;
using System.Collections.Generic;

public class Program
{
	public static void Main()
	{
		var arr = new List() {"1", null, "   ", String.Empty, "hello"};
		foreach (string txt in arr)
		{
			Console.WriteLine("IsStringEmpty? " + IsStringEmpty(txt));
		}
	}

	public static bool IsStringEmpty(string myString)
	{
		if (myString == null)
			return true;
		myString = myString.Trim();
		return myString == String.Empty || myString.Length == 0;
	}
}
```

will return

```
IsStringEmpty? False
IsStringEmpty? True
IsStringEmpty? True
IsStringEmpty? True
IsStringEmpty? False
```

Fine. Too tricky, isn't it? And we just reinvented the wheel.

## .NET native methods: String.IsNullOrEmpty and String.IsNullOrWhitespace

C# provides two methods to achieve this result, [String.IsNullOrEmpty](https://docs.microsoft.com/en-us/dotnet/api/system.string.isnullorempty "String.IsNullOrEmpty documentation") and  [String.IsNullOrWhiteSpace](https://docs.microsoft.com/en-us/dotnet/api/system.string.isnullorwhitespace "String.IsNullOrWhitespace documentation"), with a subtle difference.

`String.IsNullOrEmpty` checks only if __the string passed as parameter has at least one symbol__, so it doesn't recognize strings composed by empty characters.

`String.IsNullOrWhitespace` covers the scenario described in this post. It checks __both empty characters and for escape characters__.

```cs
string str1 = "hello";
Console.WriteLine(String.IsNullOrEmpty(str1)); //False
Console.WriteLine(String.IsNullOrWhiteSpace(str1)); //False

string str2 = null;
Console.WriteLine(String.IsNullOrEmpty(str2)); //True
Console.WriteLine(String.IsNullOrWhiteSpace(str2)); //True

string str3 = "";
Console.WriteLine(String.IsNullOrEmpty(str3)); //True
Console.WriteLine(String.IsNullOrWhiteSpace(str3)); //True

string str4 = "\n   \t   ";
Console.WriteLine(String.IsNullOrEmpty(str4)); //False
Console.WriteLine(String.IsNullOrWhiteSpace(str4)); //True

string str5 = "       ";
Console.WriteLine(String.IsNullOrEmpty(str5)); //False
Console.WriteLine(String.IsNullOrWhiteSpace(str5)); //True
```

You can see a live example [here](http://volatileread.com/utilitylibrary/snippetcompiler?id=120726 "Live example").

## Wrapping up

As you can see, out of the box .NET provides easy methods to handle your strings. You shouldn't reinvent the wheel when everything is already done.
