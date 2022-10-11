---
title: "Clean code tip: use the same name for the same concept"
path: "/cleancodetips/use-same-name-for-same-concept"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.jpg"
excerpt: "Smaller functions help us write better code, but have also a nice side effect: they help us to understand where an exception was thrown. Let's see how!"
created: 2021-10-05
updated: 2021-10-05
---

As I always say, naming things is hard. We've already talked about this in [a previous article](./choose-meaningful-names "How to choose meaningful names tip on Code4IT").

By creating a **simple and coherent dictionary**, your classes will have better names because you are representing the same idea with the same name. This improves code readability and searchability. Also, by simply looking at the names of your classes you can grasp the meaning of them.

Say that we have 3 objects that perform similar operations: they download some content from external sources.

```cs
class YouTubeDownloader {    }

class TwitterDownloadManager {    }

class FacebookDownloadHandler {    }
```

Here we are using 3 words to use the same concept: _Downloader_, _DownloadManager_, _DownloadHandler_. Why??

So, if you want to see similar classes, you can't even search for "Downloader" on your IDE.

**The solution? Use the same name to indicate the same concept!**

```cs
class YouTubeDownloader {    }

class TwitterDownloader {    }

class FacebookDownloader {    }
```

It's as simple as that! Just a small change can drastically improve the readability and usability of your code!

So, consider also this small kind of issue when reviewing PRs.

## Conclusion

A common dictionary helps to understand the code without misunderstandings. Of course, this tip does not refer only to class names, but to variables too. Avoid using synonyms for objects (eg: _video_ and _clip_). Instead of synonyms, use more specific names (_YouTubeVideo_ instead of _Video_).

Any other ideas?

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1345054176506765313 "Original post on Twitter") or on the comment section below!

🐧
