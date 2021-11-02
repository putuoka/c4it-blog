---
title: "Clean Code Tip: Don't use too many method arguments"
path: '/cleancodetips/too-many-method-arguments'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt : "When a function has too many parameters, it's clear that something is wrong. But... why? What are the consequences of having too many parameters?"
created: 2021-11-02
updated: 2021-11-02
---

Many times, we tend to add too many parameters to a function. But that's not the best idea: on the contrary, when a function requires too many arguments, grouping them into coherent objects helps writing simpler code.

Why? How can we do it? What are the main issues with having too many params? Have a look at the following snippet:

```cs
void SendPackage(
    string name, 
    string lastname, 
    string city, 
    string country,
    string packageId
    ) { }
```

If you need to use another field about the address or the person, you will need to add a new parameter and update all the existing methods to match the new function signature.

What if we added a *State* argument? Is this part of the address (*state = "Italy"*) or something related to the package (*state = Damaged*)?

Storing this field in the correct object helps understanding its meaning.

```cs
void SendPackage(Person person, string packageId) { }

class Person { 
    public string Name { get; set; }
    public string LastName { get; set; }
    public Address Address {get; set;}
}

class Address { 
    public string City { get; set; }
    public string Country { get; set; }
}
```

Another reason to avoid using lots of parameters? **To avoid merge conflicts**.

Say that two devs, Alice and Bob, are working on some functionalities that impact the `SendPackage` method. Alice, on her branch, adds a new param, `bool withPriority`. In the meanwhile, Bob, on his branch, adds `bool applyDiscount`. Then, both Alice and Bob merge together their branches on the main one. What's the result? Of course, a conflict: the method now has two boolean parameters, and the order by which they are added to the final result may cause some troubles. Even more, because every call to the `SendPackage` method has now one (or two) new params, whose value depends on the context. So, after the merge, the value that Bob defined for the `applyDiscount` parameter might be used instead of the one added by Alice.

## Conclusion

To recap, why do we need to reduce the number of parameters?

* to give context and meaning to those parameters
* to avoid errors for positional parameters
* to avoid merge conflicts

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1347591898525941765 "Original post on Twitter") or on the comment section below!

🐧
