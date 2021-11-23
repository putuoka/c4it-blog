---
title: "How to parse JSON Lines (JSONL) with C# "
path: '/blog/parse-jsonlines'
tags: ["CSharp"]
featuredImage: "./cover.png"
excerpt: "JSONL is JSON's less famous sibling: it allows you to store JSON objects separating them with new line. We will learn how to parse a JSONL string with C#."
created: 2021-11-23
updated: 2021-11-23
---

For sure, you already know JSON: it's one of the most commonly used formats to share data as text.

Did you know that there are different *flavors* of JSON? One of them is **JSONL**: it represents a JSON document where the **items are in different lines** instead of being in an array of items.

It's quite a rare format to find, so it can be tricky to understand how it works and how to parse it. In this article, we will learn how to parse a JSONL file with C#.


## Introducing JSONL

As explained in the [JSON Lines documentation](https://jsonlines.org/), a JSONL file is a file composed of different items separated by a `\n` character.

So, instead of having

```json
[
    { "name" : "Davide" },
    { "name" : "Emma" }
]

```

you have a list of items without an array grouping them.

```json
{ "name" : "Davide" }
{ "name" : "Emma" }
```

I must admit that I've never heard of that format until a few months ago. Or, even better, I've already used JSONL files without knowing: **JSONL is a common format for logs**, where every entry is added to the file in a continuous stream.

Also, JSONL has some characteristics:

* every item is a valid JSON item
* every line is separated by a `\n` character (or by `\r\n`, but `\r` is ignored)
* it is encoding using UTF-8

So, now, it's time to parse it!

## Parsing the file

Say that you're creating a videogame, and you want to read all the items found by your character:

```cs
class Item { 
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
}
```

The items list can be stored in a JSONL file, like this:

```json
{  "id": 1,  "name": "dynamite",  "category": "weapon" }
{  "id": 2,  "name": "ham",  "category": "food" }
{  "id": 3,  "name": "nail",  "category": "tool" }
```

Now, all we have to do is to read the file and parse it.

Assuming that we've read the content from a file and that we've stored it in a string called `content`, we can **use Newtonsoft** to parse those lines.

As usual, let's see how to parse the file, and then we'll deep dive into what's going on. (Note: the following snippet comes from [this question](https://stackoverflow.com/questions/29729063/line-delimited-json-serializing-and-de-serializing) on Stack Overflow)

```cs
List<Item> items = new List<Item>();

var jsonReader = new JsonTextReader(new StringReader(content))
{
    SupportMultipleContent = true // This!!!
};

var jsonSerializer = new JsonSerializer();
while (jsonReader.Read())
{
    Item item = jsonSerializer.Deserialize<Item>(jsonReader);
    items.Add(item);
}
return items;
```

Let's break it down:

```cs
var jsonReader = new JsonTextReader(new StringReader(content))
{
    SupportMultipleContent = true // This!!!
};
```

The first thing to do is to create an instance of `JsonTextReader`, a class coming from the `Newtonsoft.Json` namespace. The constructor accepts a `TextReader` instance or any derived class. So we can use a `StringReader` instance that represents a stream from a specified string.

The key part of this snippet (and, somehow,  of the whole article) is the `SupportMultipleContent` property: when set to `true` it allows the `JsonTextReader` to keep reading the content as multiline.

Its definition, in fact, says that:

```cs
//
// Summary:
//     Gets or sets a value indicating whether multiple pieces of JSON content can be
//     read from a continuous stream without erroring.
//
// Value:
//     true to support reading multiple pieces of JSON content; otherwise false. The
//     default is false.
public bool SupportMultipleContent { get; set; }
```

Finally, we can read the content:

```cs
var jsonSerializer = new JsonSerializer();
while (jsonReader.Read())
{
    Item item = jsonSerializer.Deserialize<Item>(jsonReader);
    items.Add(item);
}
```

Here we create a new `JsonSerializer` (again, coming from Newtonsoft), and use it to read one item at a time.

The `while (jsonReader.Read())` allows us to read the stream till the end. And, to parse each item found on the stream, we use `jsonSerializer.Deserialize<Item>(jsonReader);`.

The `Deserialize` method is smart enough to parse every item even without a `,` symbol separating them, because we have the `SupportMultipleContent` to `true`.

Once we have the `Item` object, we can do whatever we want, like adding it to a list.

## Further readings

As we've learned, there are different *flavors* of JSON. You can read an overview of them on Wikipedia.

🔗 [JSON Lines introduction | Wikipedia](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON)

Of course, the best place to learn more about a format it's its official documentation.

🔗 [JSON Lines documentation | Jsonlines](https://jsonlines.org/)

This article exists thanks to Imran Qadir Baksh's question on Stack Overflow, and, of course, to Yuval Itzchakov's answer.

🔗 [Line delimited JSON serializing and de-serializing | Stack Overflow](https://stackoverflow.com/questions/29729063/line-delimited-json-serializing-and-de-serializing)

Since we've used Newtonsoft (aka: JSON.NET), you might want to have a look at its website.

🔗[SupportMultipleContent property | Newtonsoft](https://www.newtonsoft.com/json/help/html/P_Newtonsoft_Json_JsonReader_SupportMultipleContent.htm)

Finally, the repository used for this article.

🔗 [JsonLinesReader repository | GitHub](https://github.com/code4it-dev/JsonLinesReader)

## Conclusion

You might be thinking:

> Why has Davide written an article about a comment on Stack Overflow?? I could have just read the same info there!

Well, if you were interested only in the main snippet, you would've been right!

But this article exists for two main reasons. 

First, I wanted to highlight that **JSON is not always the best choice for everything**: it always depends on what we need. For continuous streams of items, JSONL is a good (if not the best) choice. Don't choose the _most used_ format: choose what best fits your needs!

Second, I wanted to remark that **we should not be too attached to a specific library**: I'd generally prefer using native stuff, so, for reading JSON files, my first choice is `System.Text.Json`. But not always it's the best choice. Yes, we could write some complex workaround (like the second answer on Stack Overflow), but... does it worth it? _Sometimes_ it's better to use another library, even if just for one specific task. So, you could use `System.Text.Json` for the whole project unless for the part where you need to read a JSONL file.


Have you ever met some unusual format? How did you dealt with it?

Happy coding!

🐧
