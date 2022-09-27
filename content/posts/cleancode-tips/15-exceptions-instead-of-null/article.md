---
title: "Clean Code Tip: throw exceptions instead of returning null when there is no fallback"
path: '/cleancodetips/exceptions-instead-of-null'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "In case of unmanageable error, should you return null or throw exceptions?"
created: 2022-09-27
updated: 2022-09-27
---

**When you don't have any fallback** operation to manage null values (eg: retry pattern), you should throw an exception instead of returning null.

You will clean up your code and make sure that, if something cannot be fixed, it gets caught as soon as possible.

## Don't return null or false

Returning nulls impacts the readability of your code. The same happens for boolean results for operations. And you still have to catch other exceptions.

Take this example:

```cs
bool SaveOnFileSystem(ApiItem item)
{
    // save on file system
    return false;
}

ApiItem GetItemFromAPI(string apiId)
{
    var httpResponse = GetItem(apiId);
    if (httpResponse.StatusCode == 200)
    {
        return httpResponse.Content;
    }
    else
    {
        return null;
    }
}

DbItem GetItemFromDB()
{
    // returns the item or null
    return null;
}
```

If all those methods complete successfully, they return an object (`DbItem`, `ApiItem`, or `true`); if they fail, they return `null` or `false`.

How can you consume those methods?

```cs
void Main()
{
    var itemFromDB = GetItemFromDB();
    if (itemFromDB != null)
    {
        var itemFromAPI = GetItemFromAPI(itemFromDB.ApiId);

        if (itemFromAPI != null)
        {
            bool successfullySaved = SaveOnFileSystem(itemFromAPI);.

            if (successfullySaved)
                Console.WriteLine("Saved");
        }
    }
    Console.WriteLine("Cannot save the item");
}
```

Note that there is nothing we can do in case something fails. So, do we really need all that nesting? We can do better!

## Throw Exceptions instead

Let's throw exceptions instead:

```cs
void SaveOnFileSystem(ApiItem item)
{
    // save on file system
    throw new FileSystemException("Cannot save item on file system");
}


ApiItem GetItemFromAPI(string apiId)
{
    var httpResponse = GetItem(apiId);
    if (httpResponse.StatusCode == 200)
    {
        return httpResponse.Content;
    }
    else
    {
        throw new ApiException("Cannot download item");
    }
}


DbItem GetItemFromDB()
{
    // returns the item or throws an exception
    throw new DbException("item not found");
}
```

Here, each method can complete in two statuses: it either completes successfully or it throws an exception **of a type that tells us about the operation that failed**.

We can then consume the methods in this way:


```cs
void Main()
{
    try
    {
        var itemFromDB = GetItemFromDB();
        var itemFromAPI = GetItemFromAPI(itemFromDB.ApiId);
        SaveOnFileSystem(itemFromAPI);
        Console.WriteLine("Saved");
    }
    catch(Exception ex)
    {
        Console.WriteLine("Cannot save the item");
    }

}
```

Now the reader does not have to spend time reading the nested operations, it's all more linear and immediate.

## Conclusion

Remember, this way of writing code should be used only when you cannot do anything if an operation failed. **You should use exceptions carefully!**

Now, a question for you: if you need more statuses as a return type of those methods (so, not only "success" and "fail", but also some other status like "partially succeeded"), how would you transform that code?

Happy coding!

🐧
