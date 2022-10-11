---
title: "C# Tip: Convert ExpandoObjects to IDictionary"
path: "/csharptips/expandoobject-to-dictionary"
tags: ["CSharp", "CSharp Tip"]
featuredImage: "./cover.png"
excerpt: "How to get all the keys of an ExpandoObject? Convert it to Dictionary!"
created: 2022-05-10
updated: 2022-05-10
---

In C#, `ExpandoObjects` are dynamically-populated objects without a predefined _shape_.

```cs
dynamic myObj = new ExpandoObject();
myObj.Name ="Davide";
myObj.Age = 30;
```

`Name` and `Age` are not part of the definition of `ExpandoObject`: they are two fields I added without declaring their type.

This is a dynamic object, so I can add new fields as I want. Say that I need to add my City: I can simply use

```cs
myObj.City = "Turin";
```

without creating any field on the `ExpandoObject` class.

Now: how can I retrieve all the values? Probably the best way is by converting the `ExpandoObject` into a `Dictionary`.

## Create a new Dictionary

Using an `IDictionary` makes it easy to access the keys of the object.

If you have an `ExpandoObject` that will not change, you can use it to create a new `IDictionary`:

```cs
dynamic myObj = new ExpandoObject();
myObj.Name ="Davide";
myObj.Age = 30;


IDictionary<string, object?> dict = new Dictionary<string, object?>(myObj);

//dict.Keys: [Name, Age]

myObj.City ="Turin";

//dict.Keys: [Name, Age]
```

Notice that we use the `ExpandoObject` to create a _new_ `IDictionary`. This means that after the Dictionary creation if we add a new field to the `ExpandoObject`, that new field will not be present in the Dictionary.

## Cast to IDictionary

If you want to use an IDictionary to get the `ExpandoObject` keys, and you need to stay in sync with the `ExpandoObject` status, you just have to **cast that object to an IDictionary**

```cs
dynamic myObj = new ExpandoObject();
myObj.Name ="Davide";
myObj.Age = 30;

IDictionary<string, object?> dict = myObj;

//dict.Keys: [Name, Age]

myObj.City ="Turin";

//dict.Keys: [Name, Age, City]
```

This works because **`ExpandoObject` implements `IDictionary`**, so you can simply cast to IDictionary without instantiating a new object.

Here's the class definition:

```cs
 public sealed class ExpandoObject :
	IDynamicMetaObjectProvider,
	IDictionary<string, object?>,
	ICollection<KeyValuePair<string, object?>>,
	IEnumerable<KeyValuePair<string, object?>>,
	IEnumerable,
	INotifyPropertyChanged
```

## Wrapping up

Both approaches are correct. They both create the same `Dictionary`, but they act differently when a new value is added to the `ExpandoObject`.

Can you think of any pros and cons of each approach?

Happy coding!

🐧
