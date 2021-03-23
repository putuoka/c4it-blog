---
title: "Clean code tips - names and functions"
path: "/blog/clean-code-names-and-functions"
tags: ["Clean Code"]
featuredImage: "./cover.jpg"
excerpt:  "I don't have to tell you why you need to write clean code. Here you'll see some tips about how to name things and how to structure functions"
created: 2020-07-21
updated: 2020-07-21
---

A few days ago I started (re)reading [Clean Code by Robert Martin](https://www.amazon.it/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882 "Clean Code by Uncle Bob"). It's a fundamental book for programmers, so it worth reading it every once in a while.

But this time I decided to share on Twitter some of the tips that I find interesting.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;m re-reading Clean Code by Robert Martin (I know you&#39;ve already read that, aren&#39;t you? 😎) <br><br>While reading it I&#39;ll post with the <a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> hashtag some of the tips I find interesting/I want to discuss with you. I&#39;ll not start a thread under this tweet to avoid clutter.<br><br>GO!</p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1278369328820346881?ref_src=twsrc%5Etfw">July 1, 2020</a></blockquote>

If you are on Twitter, you can follow the retweets to this tweet, and join me in this reading.

In this series of articles, I'll sum up what I've learned reading chapter 2 - Meaningful Names, and 3 - Functions.

Here's the list (in progress)

1. names and function arguments
2. [comments and formatting](./clean-code-comments-and-formatting "Clean code tips - comments and formatting")
3. [abstraction and objects](./clean-code-abstraction-and-objects "Clean code tips - Abstraction and objects")
4. [error handling](./clean-code-error-handling "Clean code tips - Error handling")
5. [tests](./clean-code-tests "Clean code tips - tests")

## 1: Use consistent names

<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr">❗ don&#39;t use different names to indicate the same abstract concept:<br><br>❌get, fetch, retrieve in different classes<br>✅be consistent and use always the same name<br><br>Consistency is important!<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/CodeNewbies?src=hash&amp;ref_src=twsrc%5Etfw">#CodeNewbies</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1278374169248509952?ref_src=twsrc%5Etfw">July 1, 2020</a> </blockquote>

A good way to have a clean code is to use consistent names through the whole codebase. Just imagine what happens if you use different names to indicate the same concept.

Imagine that you need to retrieve data from many sources. You could define these methods

```cs
getArticles()
fetchUsers()
retrievePages()
```

and these other ones

```cs
getArticles()
getUsers()
getPages()
```

See the difference?

At the same time, there's a big difference between

```cs
getArticleById(string id)
fetchSingleUser(string id)
useIdToRetrievePage(string id)
```

and

```cs
getArticleById(string id)
getUserById(string id)
getPageById(string id)
```

don't you think?

## 2: Keep simple, small functions with meaningful names

Remember that your code must be clean enough to be easily readable without spending too much time trying to guess what a function does. Smaller functions are easier to read and to understand.

Take this function:

```cs
string printOnlyOddNumbers(int[] numbers)
{
	List<int> n = new List<int>() { };
	List<int> rev = new List<int>() { };
	foreach (var number in numbers)
	{
		if (number % 2 == 1)
		{
			n.Add(number);
		}
	}

	for (int i = n.Count - 1; i >= 0; i--)
	{
		rev.Add(n.ElementAt(i));
	}

	StringBuilder sb = new StringBuilder();
	for (int i = 0; i < rev.Count; i++)
	{
		sb.Append(rev.ElementAt(i));
	}
	return sb.ToString();
}
```

What can you see?

1. the variables have meaningless names (what do _n_, _rev_ and _sb_ mean?)
2. it does multiple things: it filters the numbers, reverses the list and saves them into a string
3. the function name lies: it does not print the numbers, it stores them into a string.
4. it has many levels of indentation: an IF within a FOR within a function.

Isn't it better if we could split it into multiple, simpler functions with better names?

```cs
string storeOddNumbersInAReversedString(int[] numbers)
{
	List<int> oddNumbers = new List<int>() { };
	List<int> reversedNumbers = new List<int>() { };
	oddNumbers = getOnlyOddNumbers(numbers);
	reversedNumbers = reverseNumbers(oddNumbers);

	return storeNumbersInString(reversedNumbers);
}

List<int> getOnlyOddNumbers(int[] numbers)
{
	return numbers.Where(n => n % 2 == 1).ToList();
}

List<int> reverseNumbers(List<int> numbers)
{
	 numbers.Reverse();
	 return numbers;
}

string storeNumbersInString(List<int> numbers)
{
	StringBuilder sb = new StringBuilder();
	for (int i = 0; i < numbers.Count; i++)
	{
		sb.Append(numbers.ElementAt(i));
	}
	return sb.ToString();
}
```

Still not perfect, but it's better than the original function. 
Have a look at the _reverseNumbers_ function. It will cause trouble, and we'll see why soon.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ Keep functions small! The indent level should be 1 or 2, so avoid nesting too much code.<br>Split big functions into multiple, meaningful functions, and make the code more readable!<br><br>Of course, use meaningful names!<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/CodeNewbie?src=hash&amp;ref_src=twsrc%5Etfw">#CodeNewbie</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1278401074714619904?ref_src=twsrc%5Etfw">July 1, 2020</a></blockquote>

Also, notice how I changed the name of the main function: _storeOddNumbersInAReversedString_ is longer than _printOnlyOddNumbers_, but it helps to understand what's going on.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ &quot;A long descriptive name is better than a short<br>enigmatic name. A long descriptive name is better than a long descriptive comment&quot;<br><br>I think this statement should be printed in many offices :)<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/100DaysOfCode?src=hash&amp;ref_src=twsrc%5Etfw">#100DaysOfCode</a> <a href="https://twitter.com/hashtag/CodeNewbies?src=hash&amp;ref_src=twsrc%5Etfw">#CodeNewbies</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1280954059214782465?ref_src=twsrc%5Etfw">July 8, 2020</a></blockquote>

## 3: Keep a coherent abstraction level

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗Keep a coherent abstraction level in each function<br><br>❌printWithDiscount(prod){<br>price = prod.Price<br>finalPrice = price*0.9<br>Console.Write(finalPrice)}<br><br>✅printWithDiscount(prod){<br>price = prod.Price<br>finalPrice = calcFinalPrice(price)<br>print(finalPrice)}<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/bestpractices?src=hash&amp;ref_src=twsrc%5Etfw">#bestpractices</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1280617096272121857?ref_src=twsrc%5Etfw">July 7, 2020</a></blockquote>

Don't mix different abstraction levels in the same function:

```cs
string storeOddNumbersInAReversedString_WithStringBuilder(int[] numbers)
{
	List<int> oddNumbers = new List<int>() { };
	List<int> reversedNumbers = new List<int>() { };
	oddNumbers = getOnlyOddNumbers(numbers);
	reversedNumbers = reverseNumbers(oddNumbers);

	StringBuilder sb = new StringBuilder();
	for (int i = 0; i < reversedNumbers.Count; i++)
	{
		sb.Append(numbers.ElementAt(i));
	}
	return sb.ToString();
}
```

Here in the same function I have two high-level functions (_getOnlyOddNumbers_ and _reverseNumbers_) and some low-level concepts (the for loop and the _.Append_ usage on a _StringBuilder_).

It can cause confusion on the reader because he won't know what are important details and what are abstract operations. You've already seen how to solve this issue.

## 4: Prefer polymorphism over switch statements

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ switch statements can be avoided with polymorphism.<br><br>Instead of using a Switch on an object property, use subclasses: this will make your code more reliable &amp; with fewer repetitions (you won&#39;t need to repeat the switch statement in different methods)<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/codenewbies?src=hash&amp;ref_src=twsrc%5Etfw">#codenewbies</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1280951477310304261?ref_src=twsrc%5Etfw">July 8, 2020</a></blockquote>

You have this Ticket class:

```cs
public enum TicketType
{
	Normal,
	Premium,
	Family,
	Free
}

public class Ticket
{
	public DateTime ExpirationDate { get; set; }
	public TicketType TicketType { get; set; }
}
```

And a Cart class that, given a Ticket and a quantity, calculates the price for the purchase:

```cs
public class Cart
{
	public int CalculatePrice(Ticket ticket, int quantity)
	{
		int singlePrice;
		switch (ticket.TicketType)
		{
			case TicketType.Premium: singlePrice = 7; break;
			case TicketType.Family: singlePrice = 4; break;
			case TicketType.Free: singlePrice = 0; break;
			default: singlePrice = 5; break;
		}
		return singlePrice * quantity;
	}
}
```

Needless to say, this snippet sucks! It has static values for the single prices of the tickets based on the ticket type.

The ideal solution is to remove (almost) all the switch statements using polymorphism: every subclass manages its own information and the client doesn't have to repeat the same switch over and over.

First of all, create a subclass for every type of ticket:

```cs
public abstract class Ticket
{
	public DateTime ExpirationDate { get; set; }
	public abstract int SinglePrice { get; }
}

public class NormalTicket : Ticket
{
	public override int SinglePrice { get => 5; }
}

public class PremiumTicket : Ticket
{
	public override int SinglePrice { get => 7; }
}

public class FamilyTicket : Ticket
{
	public override int SinglePrice { get => 4; }
}

public class FreeTicket : Ticket
{
	public override int SinglePrice { get => 0; }
}
```

and simplify the CalculatePrice function:

```cs
public int CalculatePrice(Ticket ticket, int quantity)
{
    return ticket.SinglePrice * quantity;
}
```

No more useless code! And now if you need to add a new type of ticket you don't have to care about adding the case branch in every switch statement, but you only need a new subclass.

I said that you should almost remove every switch statement. That's because you need to create those objects somewhere, right?

```cs
public class TicketFactory
{
	public Ticket CreateTicket(TicketType type, DateTime expirationDate)
	{
		Ticket ticket = null;
		switch (type)
		{
			case TicketType.Family:
				ticket = new FamilyTicket() { ExpirationDate = expirationDate };
				break;
			case TicketType.Free:
				ticket = new FreeTicket() { ExpirationDate = expirationDate };
				break;
			case TicketType.Premium:
				ticket = new PremiumTicket() { ExpirationDate = expirationDate };
				break;
			default:
				ticket = new FamilyTicket() { ExpirationDate = expirationDate };
				break;

		}
		return ticket;
	}
}
```

THIS is where you must use the _TicketType_ enum and add new subclasses of the Ticket class!

_PSST: wanna know some cool things about Enums? [Here's something for you!](./5-things-enums-csharp "5 things you didn't know about enums in C#")_

## 5: avoid side effects

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗You know, functions must do 1 thing and do it well.<br><br>This also means avoid side effects: if you do that &quot;one thing&quot; and also change the state of the system, you are doing more things. <br><br>But, if it&#39;s inevitable, at least say it in the fn name!<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/codenewbie?src=hash&amp;ref_src=twsrc%5Etfw">#codenewbie</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1282316483431993349?ref_src=twsrc%5Etfw">July 12, 2020</a></blockquote>

You often hear (correctly) that 

> A function must do one thing and to it well

This means that you also need to take care of side effects: __avoid changing the state of the system or of the input parameters__.

Do you remember the _reverseNumbers_ function from the example above?

```cs
List<int> reverseNumbers(List<int> numbers)
{
	 numbers.Reverse();
	 return numbers;
}
```
It does a terrible, terrible thing: it reverses the input parameter!

```cs
List<int> numbers = new List<int> {1,2,3};

var reversedNumbers = reverseNumbers(numbers);
// numbers = 3,2,1
// reversedNumbers = 3,2,1
```

So now the state of the input parameter has changed without notifying anyone. Just avoid it!

## 6: Fewer arguments, better readability

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗How many function arguments? Ideally, 0 or 1: this helps you split a bigger problem in different small ones. Divide et impera.<br><br>Best cases to one an argument? Check a property on that arg (ex: it exists) or transform an input in an output.<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/codenewbie?src=hash&amp;ref_src=twsrc%5Etfw">#codenewbie</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1282303752700125185?ref_src=twsrc%5Etfw">July 12, 2020</a></blockquote>

Keep the number of function arguments as small as possible. Ideally you should have 0 or 1 arguments, but even 2 or 3 are fine. If more... well, you have to think about how to refactor your code!

What are the best cases for using one argument?

* Check a property on that input (eg: `isOdd(int number)`)
* Transform the input variable (eg: `ToString(int number)`)

Sometimes you just cannot use a single parameter, for example for coordinates. But you can group this information in an object and work on it. __It's not cheating if there's a logic behind this grouping!__

## 7: Prefer exceptions over error codes

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗Prefer exceptions over error codes.<br><br>Error codes are often stored in enums, and then shared across the whole project.<br><br>If you change that enum, you must update the dependency in many places. So, if possible, avoid them.<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://twitter.com/hashtag/CodeNewbie?src=hash&amp;ref_src=twsrc%5Etfw">#CodeNewbie</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1282382545930334214?ref_src=twsrc%5Etfw">July 12, 2020</a></blockquote>

Remember what I said about polymorphism and enums? The same applies to exceptions.

```cs
enum StatusCode {
	OK,
	NotFound,
	NotAuthorized,
	GenericError
}

StatusCode DoSomething(int variable){
	// do something
	return StatusCode.GenericError;
}
```

So for every user you should explicitly check for the returned status, adding more useless code.

Also, consider that if the _DoSomething_ method also returns a value, you must return a tuple or a complex object to represent both the status and the value.

```cs
class Result
{
	public int? Value { get; set; }
	public StatusCode StatusCode { get; set; }
}

Result GetHalf(int number)
{
	if (number % 2 == 0) return new Result
	{
		Value = number / 2,
		StatusCode = StatusCode.OK
	}
	else
	{
		return new Result
		{
			Value = null,
			StatusCode = StatusCode.GenericError
		}
	}
}
```

## Conclusion

This is a recap of chapters 2 and 3 of Clean Code. We've seen how to write readable code, with small functions that are easy to test and, even better, easy to understand.

As you've seen, __I haven't shown perfect code__, but I focused on small improvements: reaching clean code is a long path, and you must approach it one step at a time.

As soon as I read the other chapters I'll post some new tips.

Happy coding!
