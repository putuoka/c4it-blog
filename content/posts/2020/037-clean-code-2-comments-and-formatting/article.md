---
title: "Clean code tips - comments and formatting"
path: "/blog/clean-code-comments-and-formatting"
tags: [ "Clean Code"]
featuredImage: "./cover.jpg"
excerpt: "Are all comments bad? When they are necessary? Why formatting is so important? Writing clean code does not only refer to the executed code, but also to everything around."
created: 2020-08-18
updated: 2020-08-18
---


This is the second part of my series of tips about clean code. We'll talk about comments, why many of them are useless or even dangerous, why some are necessary and how to improve your comments. We'll also have a look at why formatting is so important, and we can't afford to write messy code.

Here's the list (in progress)

1. [names and function arguments](./clean-code-names-and-functions "Clean code tips - names and functions")
2. comments and formatting
3. [abstraction and objects](./clean-code-abstraction-and-objects "Clean code tips - Abstraction and objects")
4. [error handling](./clean-code-error-handling "Clean code tips - Error handling")

## Comments are generally bad, but sometimes necessary

Often you see comments that explain what a method or a class does. 

```csharp
/// <summary>
/// Returns the max number of an array
/// </summary>
/// <param name="numbers">array of numbers</param>
/// <returns>Max number in the array</returns>
public int GetMaxNumber(int[] numbers)
{
    // return max;
    return numbers.Max();
}
```

What's the point of this comment? Nothing: it doesn't add more info about the method meaning. Even worse, it clutters the codebase and makes the overall method harder to read.

Luckily sometimes comments are helpful; rare cases, but they exist.

## Good comments

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ Not all comments are evil. Some good examples?<br>1. intentions (what does this regex mean?)<br>2. reasons (eg: why is that the default value?)<br>3. // TODO comments (only if temporary!!)<br>4. highlight the importance of some code<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1284601759214833666?ref_src=twsrc%5Etfw">July 18, 2020</a></blockquote> 


Yes, sometimes comments are useful. Or even necessary. Let's see when.

### Show intention and meaning

Sometimes the external library you're using is not well documented, or you are writing an algorithm that needs some explanations. Put a comment to explain __what__ you are doing and __why__.

Another example is when you are using _regular expressions_: the meaning can be really hard to grasp, so using a comment to explain what you are doing is the best thing to do:

```csharp
public bool CheckIfStringIsValid(string password)
{
    // 2 to 7 lowercase chars followed by 3 or 4 numbers
    // Valid:   kejix173
    //          aoe193
    // Invalid: a92881
    Regex regex = new Regex(@"[a-z]{2,7}[1-9]{3,4}");
    var hasMatch = regex.IsMatch(password);
    return hasMatch;
}
```

### Reason for default values

Some methods have default values, and you'd better explain why you chose that value:

```csharp
public string FindPerfectAnimal(List<Criterion> criteria)
{
    string perfectAnimal = ElaborateCriteria(criteria);
    // We use "no-preferences" so we can easily perform queries on the DB and show it on the UI
    return string.IsNullOrEmpty(perfectAnimal) ? "no-preferences" : perfectAnimal;
}
```

What if you didn't add that comment? Maybe someone will be tempted to change that value, thus breaking both the UI and the DB.

### TODO marks

Yes, you can add TODO comments in your code. Just don't use it as an excuse for not fixing bugs, refactor your code and rename functions and variables with better names.

```csharp
public void Register(string username, string password)
{
    // TODO: add validation on password strenght
    dbRepository.RegisterUser(username, password);
}
```

Some IDEs have a TODO window that recognizes those comments: so, yes, it's a common practice!

### Highlight the importance of some code

Some method calls seem redundant but they actually make the difference. A good practice is to highlight whose parts and explain why they are so important.

```csharp
public string GetImagePath(string resourceId)
{
    var item = dbRepository.GetItem(resourceId);

    // The source returns image paths with trailing whitespaces. We must remove them.
    return item.ImagePath.Trim();
}
``` 

## Bad comments

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ When a comment is bad?<br>1. It doesn&#39;t say anything important not already written in code<br>2. It lies (maybe because the code has changed in the meanwhile)<br>3. It&#39;s used to indicate the end of a method (if you need them, refactor the method!)<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1284603160221429760?ref_src=twsrc%5Etfw">July 18, 2020</a></blockquote> 

Most of the time comments should be avoided. They can lead confusion to the developer, not be updated to the latest version of the code or they just make the code harder to read. Let's see some of the bad uses of comments.

### They explain what the code does

If your code is hard to read, why spending time in writing comments to explain what the code does instead of writing better code, with better names and easier to read functions?

### They don't add anything important not already written in the code

```csharp
// sum two numbers and return the result
public int Add(int a, int b)
{
	// calculate the sum and return it to the caller
	return a + b;
}
```

What's the meaning of these comments? Absolutely nothing. They just add lines of code to be read.

### They lie

It may happen that you write your comments with the best intentions, but you don't choose the best words for your comments, and they may involuntarily lie.

Have a look at this snippet.

```csharp
// counts how many odd numbers are in the list
public int CountOddsNumbers(IEnumerable<int> values)
{
	return values.Where(v => v % 2 == 1).Count();
}
```

Where are the lies? First of all, the numbers are not _in the list_, but in an _IEnumerable_. Yes, a _List_ is an IEnumerable, but here that word can be misinterpreted. Second, what happens if the input value is null? Does this method return null, zero, or does it throw an exception? You have to check the internal code to see what's really going on.

### They are not updated

Maybe you've written the perfect comment that explains what your API does.

But suddenly, someone adds a cache layer in your code, and he doesn't update the documentation.

So you'll end up with wrong comments that are simply outdated.

### They indicate the end of a block

What do you think of this snippet?

```csharp
public int CountPalindromes(IEnumerable<string> values)
{
	int count = 0;
	foreach (var element in values)
	{
		if (!string.IsNullOrWhiteSpace(element))
		{
			var sb = new StringBuilder();
			var reversedChars = element.Reverse();
			foreach (var ch in reversedChars)
			{
				sb.Append(ch);
			}

			if (element.Equals(sb.ToString(), StringComparison.CurrentCultureIgnoreCase))
				count++;

		} // end if
	} // end foreach
	return count;
} // end CountPalindromes
```

If the code is complex enough to require _end CountPalindromes_, _end foreach_ and _end if_, isn't it better to refactor the code and use shorter methods?

```csharp
public int CountPalindromes(IEnumerable<string> values)
{
	return values
	.Where(v => !string.IsNullOrWhiteSpace(v))
	.Where(v => v.Equals(ReverseString(v), StringComparison.CurrentCultureIgnoreCase)).Count();
}

public string ReverseString(string originalString)
{
	return new string(originalString.Reverse().ToArray());
}
```

Better, isn't it?

## Both bad and good

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗ What about Javadoc-like comments?<br><br>✅ they explain what a method does and why<br>❌they just list the params without adding useful info<br>❌ they&#39;re written also for private methods<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1284604503979962369?ref_src=twsrc%5Etfw">July 18, 2020</a></blockquote> 

There are comments that are both good and bad, it depends on how you structure them. 

Take for example documentation for APIs.

```csharp
/// <summary>
/// Returns a page of items
/// </summary>
/// <param name="pageNumber">Page Number</param>
/// <param name="pageSize">Page size</param>
/// <returns>A list of items</returns>
[HttpGet]
public async Task<List<Item>> GetPage(int pageNumber, int pageSize)
{
	// do something
}
```

Useless comment, isn't it? It doesn't add anything that you could have guessed by looking at the parameters and the function name.

Can we use every value for pageNumber and for pageSize? What happens if there are no items to be returned? Does it return a particular status code or does it return an empty list?

```csharp
/// <summary>
/// Returns a page of items
/// </summary>
/// <param name="pageNumber">Number of the page to be fetched. This index is 0-based. It must be greater or equal than zero.</param>
/// <param name="pageSize">Maximum number of items to be retrieved. It must be greater or equal than zero.</param>
/// <returns>A list of up to <paramref name="pageSize"/> items. Empty result if no more items are available</returns>
[HttpGet]
[Route("getpage")]
[ProducesResponseType(200)]
[ProducesResponseType(400)]
[ProducesResponseType(500)]
public async Task<List<Item>> GetPage(int pageNumber, int pageSize)
{
	if (pageNumber < 0)
		throw new ArgumentException($"{nameof(pageNumber)} cannot be less than zero");
	if (pageSize < 0)
		throw new ArgumentException($"{nameof(pageSize)} cannot be less than zero");

	// do something
}
```

Now all these questions are addressed. Still not perfect, though. But you get the idea.

## Why spending time in code formatting?

Why bother writing well-formatted code? Do I really need to spend time in formatting? Who cares! All the code gets transformed in bits, so why care about tabs and spacing, line length and so on!

Right?

No.

Here's a great quote from that book:

> The functionality you create today has a good chance of changing in the next release, but the readability of your code will have a profound effect on all the changes that will ever be made.

## How to structure classes

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗A good structure for files?<br>Small/medium files, with the most general info on top. The more you scroll down, the more you find the details.<br><br>This will help others understanding if the file they&#39;re looking for is that one without getting lost in the code.<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1284797140607393792?ref_src=twsrc%5Etfw">July 19, 2020</a></blockquote>

Think of a class as if it was a news article. Would you prefer all the info mixed up or have a clear, structured content?
So a good idea is to have __all the general info on the top of the files__, and order the functions in a way that the more you scroll down in the file, the more you get into the details of what's going on.

This will help the readers understanding what the class does in a general way by just having a look at the top of the class. If they are interested they can just scroll down and read the details.

So a good way to structure your code can be

1. public properties
2. constructor
3. public functions
4. private functions

Some programmer prefer other structures, like

1. public functions
2. private functions
3. constructor
4. public properties

For me the second option is odd. But it's not wrong. Whichever you prefer, remember to be consistent across your codebase.

## Conclusion

We've seen some aspects that are considered secondary: coding and formatting. They are part of the codebase, and you should take care of them. 

In general, when you're writing code and comments, stop for a second and think _"is this part readable? Is it meaningful? Can I improve it?"_. 

Don't forget that you're doing it not only for others but even for your future self.

So, for now...

Happy coding!
