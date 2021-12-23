---
title: "Clean code tips - Abstraction and objects"
path: "/blog/clean-code-abstraction-and-objects"
tags: ["Clean Code" , "MainArticle"]
featuredImage: "./cover.jpg"
excerpt:  "Are Getters and Setters the correct way to think of abstraction? What are pro and cons of OOP and Procedural programming? And, in the OOP world, how can you define objects?"
created: 2020-10-20
updated: 2020-10-20
---

This is the third part of my series of tips about clean code.

Here's the list (in progress)

1. [names and function arguments](./clean-code-names-and-functions "Clean code tips - names and functions")
2. [comments and formatting](./clean-code-comments-and-formatting "Clean code tips - comments and formatting")
3. abstraction and objects
4. [error handling](./clean-code-error-handling "Clean code tips - error handling")
5. [tests](./clean-code-tests "Clean code tips - tests")


In this article, I'm going to explain how to define classes in order to make your code extensible, more readable and easier to understand. In particular, I'm going to explain how to use effectively Abstraction, what's the difference between pure OOP and Procedural programming, and how the Law of Demeter can help you structure your code.

## The real meaning of abstraction

Some people think that abstraction is nothing but adding Getters and Setters to class properties, in order to (if necessary) manipulate the data before setting or retrieving it:

```cs
interface IMixer_A
{
	void SetVolume(int value);
	int GetVolume();
	int GetMaxVolume();
}

class Mixer_A : IMixer_A
{
	private const int MAX_VOLUME = 100;
	private int _volume = 0;

	void SetVolume(int value) { _volume = value; }
	int GetVolume() { return _volume; }
	int GetMaxVolume() { return MAX_VOLUME; }
}
```

This way of structuring the class does not hide the implementation details, because any client that interacts with the Mixer knows that internally it works with _integer_ values. __A client should only know about the operations that can be performed on a Mixer__.

Let's see a better definition for an IMixer interface:

```cs
interface IMixer_B
{
	void IncreaseVolume();
	void DecreaseVolume();
	void Mute();
	void SetToMaxVolume();
}

class Mixer_B : IMixer_B
{
	private const int MAX_VOLUME = 100;
	private int _volume = 0;

	void IncreaseVolume()
	{
		if (_volume < MAX_VOLUME) _volume++;
	}
	void DecreaseVolume()
	{
		if (_volume > 0) _volume--;
	}

	void Mute() { _volume = 0; }

	void SetToMaxVolume()
	{
		_volume = MAX_VOLUME;
	}
}
```

With this version, we can perform all the available operations without knowing the internal details of the Mixer. Some advantages?

* We can change the internal type for the `_volume` field, and store it as a `ushort` or a `float`, and change the other methods accordingly. And no one else will know it!
* We can add more methods, for instance a `SetVolumeToPercentage(float percentage)` without the risk of affecting the exposed methods
* We can perform additional checks and validation before performing the internal operations

It can help you of thinking classes as if they were real objects you can interact: if you have a stereo you won't set manually the volume inside its circuit, but you'll press a button that increases the volume and performs all the operations for you. At the same time, the volume value you see on the display is a "human" representation of the internal state, not the real value.

## Procedural vs OOP

Object-oriented programming works the best if you expose behaviors so that any client won't have to access any internal properties.

Have a look at this statement from [Wikipedia](https://en.wikipedia.org/wiki/Procedural_programming "Procedural programmin definition on Wikipedia"):
> The focus of _procedural programming_ is to break down a programming task into a collection of variables, data structures, and subroutines, whereas in _object-oriented programming_ it is to break down a programming task into objects that expose behavior (methods) and data (members or attributes) using interfaces. The most important distinction is that __while procedural programming uses procedures to operate on data structures, object-oriented programming bundles the two together, so an "object", which is an instance of a class, operates on its "own" data structure__.

To see the difference between OO and Procedural programming, let's write the same functionality in two different ways. In this simple program, I'm going to generate the `<a>` tag for content coming from different sources: Twitter and YouTube.

### Procedural programming

```cs
public class IContent
{
	public string Url { get; set; }
}

class Tweet : IContent
{
	public string Author { get; set; }
}

class YouTubeVideo : IContent
{
	public int ChannelName { get; set; }
}
```

Nice and easy: the classes don't expose any behavior, but only their properties. So, a client class (I'll call it _LinkCreator_) will use their properties to generate the HTML tag.

```cs
public static class LinkCreator
{
	public static string CreateAnchorTag(IContent content)
	{
		switch (content)
		{
			case Tweet tweet: return $"<a href=\"{tweet.Url}\"> A post by {tweet.Author}</a>";
			case YouTubeVideo yt: return $"<a href=\"{yt.Url}\"> A video by {yt.ChannelName}</a>";
			default: return "";
		}
	}
}
```

We can notice that the Tweet and YouTubeVideo classes are really minimal, so they're easy to read.
But there are some __downsides__:

* By only looking at the `IContent` classes, we don't know what kind of operations the client can perform on them.
* If we add a new class that inherits from `IContent` we must implement the operations that are already in place in every client. If we forget about it, the `CreateAnchorTag` method will return an empty string.
* If we change the type of URL (it becomes a relative URL or an object of type `System.Uri`) we must update all the methods that reference that field to propagate the change.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗Procedural or OOP? 1️⃣/2️⃣<br><br>With Procedural all the operations are managed by LinkCreator.<br><br>PRO: you can add new functions to LinkCreator without affecting the Content subclasses.<br><br>CONS: when you add a new Content type, you must implement its methods in LinkCreator<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/q8eHSZbUDD">pic.twitter.com/q8eHSZbUDD</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1296470827010072577?ref_src=twsrc%5Etfw">August 20, 2020</a></blockquote>

### Object-oriented programming

In Object-oriented programming, we declare the functionalities to expose and we implement them directly within the class:

```cs
public interface IContent
{
	string CreateAnchorTag();
}

public class Tweet : IContent
{
	public string Url { get; }
	public string Author { get; }

	public string CreateAnchorTag()
	{
		return $"<a href=\"{Url}\"> A post by {Author}</a>";
	}
}

public class YouTubeVideo : IContent
{
	public string Url { get; }
	public int ChannelName { get; }

	public string CreateAnchorTag()
	{
		return $"<a href=\"{Url}\"> A video by {ChannelName}</a>";
	}
	
}
```

We can see that the classes are more _voluminous_, but just by looking at a single class, we can see what functionalities they expose and how.

So, the `LinkCreator` class will be simplified, since it hasn't to worry about the implementations:

```cs
public static class LinkCreator
{
	public static string CreateAnchorTag(IContent content)
	{
		return content.CreateAnchorTag();
	}
}
```

But even here there are some downsides:

* If we add a new `IContent` type, we must implement every method __explicitly__ (or, at least, leave a dummy implementation)
* If we expose a new method on `IContent`, we must implement it in every subclass, even when it's not required (should I care about the total video duration for a Twitter channel? Of course no).
* It's harder to create easy-to-maintain classes hierarchies

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❗Procedural or OOP? 2️⃣/2️⃣<br><br>With OOP &amp; polymorphism, each class implements its methods knowing the internal details of itself.<br><br>PRO: it&#39;s easy to add new Content classes w/o affecting the siblings<br><br>CONS: if you need to expose a new method, you need to add it to all the siblings</p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1296470828838801408?ref_src=twsrc%5Etfw">August 20, 2020</a></blockquote>

### So what?

Luckily we don't live in a world in black and white, but there are other shades: it's highly unlikely that you'll use _pure OO programming_ or _pure procedural programming_.

So, don't stick too much to the theory, but use whatever fits best to your project and yourself.

Understand Pro and Cons of each type, and apply them wherever is needed.

## Objects vs Data structure - according to Uncle Bob

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">❓ <br>&quot;Objects hide<br>their data behind abstractions and expose functions that operate on that data. Data structure<br>expose their data and have no meaningful functions&quot;<br><br>For me, a data structure (eg: linked list) exposes the operations, not the internals.<br>What do you think?<a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1297262011584114689?ref_src=twsrc%5Etfw">August 22, 2020</a></blockquote>

There's a statement by the author that is the starting point of all his following considerations:

> __Objects hide their data__ behind abstractions and expose functions that operate on that data. __Data structure expose their data__ and have no meaningful functions.

Personally, __I disagree with him__. For me it's the opposite: think of a _linked list_.

__A linked list is a data structure__ consisting of a collection of nodes linked together to form a sequence. You can perform some operations, such as _insertBefore_, _insertAfter_, _removeBefore_ and so on. But they expose only the operations, not the internal: you won't know if internally it is built with an array, a list, or some other structures.

```cs
interface ILinkedList
{
	Node[] GetList();
	void InsertBefore(Node node);
	void InsertAfter(Node node);
	void DeleteBefore(Node node);
	void DeleteAfter(Node node);
}
```

On the contrary, a simple class used just as DTO or as View Model creates _objects_, not _data structures_.

```cs
class Person
{
	public String FirstName { get; set; }
	public String LastName { get; set; }
	public DateTime BirthDate { get; set; }
}
```

Regardless of the names, it's important to know when one type is preferred instead of the other. Ideally, you should not allow the same class to expose both properties and methods, like this one:

```cs
class Person
{
	public String FirstName { get; set; }
	public String LastName { get; set; }
	public DateTime BirthDate { get; set; }

	public string CalculateSlug()
	{
		return FirstName.ToLower() + "-" + LastName.ToLower() + "-" + BirthDate.ToString("yyyyMMdd");
	}
}
```

An idea to avoid this kind of _hybrid_ is to have a different class which manipulates the `Person` class:

```cs
static class PersonAttributesManager
{
	static string CalculateSlug(Person p)
	{
		return p.FirstName.ToLower() + "-" + p.LastName.ToLower() + "-" + p.BirthDate.ToString("yyyyMMdd");
	}
}
```

In this way, we decouple the properties of a _pure_ `Person` and the possible properties that a specific client may need from that class. 

## The Law of Demeter

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">⁉the Law of Demeter says that «a module should not know about the innard of the things it manipulates»<br><br>In the bad example the Client &quot;knows&quot; that an Item exposes a GetSerialNumber. It&#39;s a kind of &quot;second-level knowledge&quot;. <br><br>A thread 🧵 - <a href="https://twitter.com/hashtag/cleancode?src=hash&amp;ref_src=twsrc%5Etfw">#cleancode</a> <a href="https://t.co/PfygNCpZGr">https://t.co/PfygNCpZGr</a> <a href="https://t.co/1ovKnasBNX">pic.twitter.com/1ovKnasBNX</a></p>&mdash; Davide Bellone 🐧 - 𝗰𝗼𝗱𝗲𝟰𝗶𝘁.𝗱𝗲𝘃 📃📃 (@BelloneDavide) <a href="https://twitter.com/BelloneDavide/status/1300087681062440963?ref_src=twsrc%5Etfw">August 30, 2020</a></blockquote> 

The __Law of Demeter__ is a programming law that says that a _module should only talk to its friends_, not to strangers. What does it mean?

Say that you have a `MyClass` class that contains a `MyFunction` class, which can accept some arguments. The Law of Demeter says that `MyFunction` should only call the methods of

1. `MyClass` itself
2. a _thing_ created within `MyFunction`
3. every _thing_ passed as a parameter to `MyFunction`
4. every _thing_ stored within the current instance of `MyClass`

This is strictly related to the fact that _things_ (objects or data structures - it depends if you agree with the Author's definitions or not) should not expose their internals, but only the operations on them.

Here's an example of what __not__ to do:

```cs
class LinkedListClient{
	ILinkedList linkedList;
	
	public void AddTopic(Node nd){
		// do something
		linkedList.NodesList.Next = nd;
		// do something else
	}
}
```

What happens if the implementation changes or you find a bug on it? You should update everything. Also, you are coupling too much the two classes.

A problem with this _rule_ is that you should not refer the most common operations on base types too:

```cs
class LinkedListClient{
	ILinkedList linkedList;
	
	public int GetCount(){
		return linkedList.GetTopicsList().Count();
	}
}
```

Here, the `GetCount` method is against the Law of Demeter, because it is performing operations on the _array_ type returned by `GetList`. To solve this problem, you have to add the `GetCount()` method to the `ILinkedList` class and call this method on the client.

When it's a single method, it's acceptable. What about operations on strings or dates?

Take the `Person` class. If we exposed the BirthDate properties as a method (something like `GetBirthDate`), we could do something like

```cs
class PersonExample{
	void DoSomething(Person person){
		var a = person.GetBirthDate().ToString("yyyy-MM-dd");
		var b = person.GetBirthDate().AddDays(52);
	}
}
```

which is perfectly reasonable. But it violates the law of Demeter: __you can't__ perform ToString and AddDays here, because you're not using only methods exposed by the `Person` class, but also those exposed by `DateTime`.

A solution could be to add new methods to the `Person` class to handle these operations; of course, it would make the class bigger and less readable.

Therefore, I think that this _law of Demeter_ is a good rule of thumb, but you should consider it only as a suggestion and not as a strict rule.

If you want to read more, you can refer to this [article by Carlos Caballero](https://medium.com/better-programming/demeters-law-don-t-talk-to-strangers-87bb4af11694 "Demeter’s Law: Don’t talk to strangers by Carlos Caballero") or to [this one by Robert Brautigam](https://dzone.com/articles/the-genius-of-the-law-of-demeter "The Genius of the Law of Demeter by Robert Brautigam").

## Wrapping up

We've seen that it's not so easy to define which behaviors a class should expose. Do we need _pure_ data or objects with a behavior? And how can _abstraction_ help us hiding the internals of a class?

Also, we've seen that it's perfectly fine to not stick to OOP principles strictly, because that's a way of programming that can't always be applied to our projects and to our processes.

Happy coding!
