---
title: "Clean code tip: Use pronounceable and searchable names"
path: '/cleancodetips/use-pronounceable-names'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.jpg"
excerpt : "Two of the operations you often do with your code is to discuss it, or perform a search over it. So using good names will help in both situations."
created: 2021-07-20
updated: 2021-07-20
---

Ok, you write code. Maybe alone. But what happens when you have to talk about the code with someone else? To help clear communication, you should always use _easily pronounceable_ name.

Choosing names with this characteristic is underrated, but often a game-changer.

Have a look at this class definition:

```cs
class DPContent
{
    public int VID { get; set; }
    public long VidDurMs { get; set; }
    public bool Awbtu { get; set; }
}
```

Would you say aloud
> Hey, Tom, have a look at the VidDurMs field!
?

No, I don't think so. That's unnatural. Even worse for the other field, `Awbtu`. _Aw-b-too_ or _a-w-b-t-u_? Neither of them makes sense when speaking aloud. That's because this is a meaningless abbreviation.

![Blah blah blah](https://media.giphy.com/media/srb6bXZHbgDsc/source.gif)


__Avoid using uncommon acronyms or unreadable abbreviations__: this helps readers understand better the meaning of your code, helps you communicate by voice with your colleagues or searching for a specific field using your IDE

_Code is meant to be read by humans, computers do not care about the length of a field name._ Don't be afraid of using long names to help clarity.

Use full names, like in this example:

```cs
class DisneyPlusContent
{
    int VideoID { get; set; } 
    long VideoDurationInMs { get; set; }
    bool AlreadyWatchedByThisUser { get; set; }
}
```

Yes, _ID_ and _Ms_ are still abbreviations for Identifier and Milliseconds. But they are obvious, so you don't have to use complete words.

Of course, all those considerations are valid not only for pronouncing names but also for searching (and remembering) them. Would you rather search _VideoID_ or _Vid_ in your text editor?

What do you prefer? Short or long names?

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1339994587952107520) or on the comment section below!

🐧