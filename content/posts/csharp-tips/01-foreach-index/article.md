---
title: "LINQ index"
path: '/csharptips/linq-index'
tags: ["CiiSharp Tippppp"]
featuredImage: "./cover.jpg"
excerpt : "hejhe."
created: 2001-03-27
updated: 2001-03-27
---


Do you need the index of the current element in a foreach loop? __LINQ__ can help you!

------

Store and update an index

```cs
List<string> myFriends = new List<string> {
    "Emma", "Rupert", "Daniel", "Maggie", "Alan"
};

int index = 0;
foreach (var friend in myFriends)
{
    Console.WriteLine($"Friend {index}: {friend}");
    index++;
}
```

----

Use `Select` from LINQ

```cs
List<string> myFriends = new List<string> {
            "Emma", "Rupert", "Daniel", "Maggie", "Alan"
            };
          
            foreach (var friend in myFriends.Select((name, index) => (name, index)))
            {
              Console.WriteLine($"Friend {friend.index}: {friend.name}");
            }

```
