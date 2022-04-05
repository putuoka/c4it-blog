---
title: "C# Tip: How to temporarily change the CurrentCulture"
path: '/csharptips/change-current-culture-in-using-block'
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "What can you do if you need to temporarily change the CurrentCulture in C#?"
created: 2022-03-08
updated: 2022-03-08
---

It may happen, even just for testing some functionalities, that you want to change the Culture of the thread your application is running on.

The current Culture is defined in this global property: `Thread.CurrentThread.CurrentCulture`. How can we *temporarily* change it?

An idea is to create a class that implements the `IDisposable` interface to create a section, delimited by a `using` block, with the new Culture:


```cs
public class TemporaryThreadCulture : IDisposable
{
	CultureInfo _oldCulture;

	public TemporaryThreadCulture(CultureInfo newCulture)
	{
		_oldCulture = CultureInfo.CurrentCulture;
		Thread.CurrentThread.CurrentCulture = newCulture;
	}

	public void Dispose()
	{
		Thread.CurrentThread.CurrentCulture = _oldCulture;
	}
}
```

In the constructor, we store the current Culture in a private field. Then, when we call the `Dispose` method (which is implicitly called when closing the `using` block), we use that value to restore the original Culture.

## How to use it

How can we try it? An example is by checking the currency symbol.


```cs
Thread.CurrentThread.CurrentCulture = new CultureInfo("ja-jp");

Console.WriteLine(Thread.CurrentThread.CurrentCulture.NumberFormat.CurrencySymbol); //￥

using (new TemporaryThreadCulture(new CultureInfo("it-it")))
{
	Console.WriteLine(Thread.CurrentThread.CurrentCulture.NumberFormat.CurrencySymbol);//€
}

Console.WriteLine(Thread.CurrentThread.CurrentCulture.NumberFormat.CurrencySymbol); //￥
```

We start by setting the Culture of the current thread to Japanese so that the Currency symbol is ￥. Then, we temporarily move to the Italian culture, and we print the Euro symbol. Finally, when we move outside the `using` block, we get back to ￥.

Here's a test that demonstrates the usage:

```cs
[Fact] 
void TestChangeOfCurrency()
{
	using (new TemporaryThreadCulture(new CultureInfo("it-it")))
	{
		var euro = CultureInfo.CurrentCulture.NumberFormat.CurrencySymbol;
		Assert.Equal(euro, "€");

		using (new TemporaryThreadCulture(new CultureInfo("en-us")))
		{
			var dollar = CultureInfo.CurrentCulture.NumberFormat.CurrencySymbol;

			Assert.NotEqual(euro, dollar);
		}
		Assert.Equal(euro, "€");
	}
}
```

## Conclusion

Using a class that implements `IDisposable` is a good way to create a temporary environment with different characteristics than the main environment. 

I use this approach a lot when I want to experiment with different cultures to understand how the code behaves when I'm not using English (or, more generically, Western) culture.

Do you have any other approaches for reaching the same goal? If so, feel free to share them in the comments section!

Happy coding!

🐧
