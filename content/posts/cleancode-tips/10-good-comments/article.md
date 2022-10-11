---
title: "Clean Code Tip: Not all comments are bad"
path: "/cleancodetips/good-comments"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Is it true that we should always avoid comments in our code? In my opinion, no: let's see when adding comments is not only good but necessary."
created: 2022-03-22
updated: 2022-03-22
---

Many developers say that

> All comments are bad! 💢

False! _Most of the_ comments are bad!

## Examples of bad comments

For example, look at this method, and look at the comments:

```cs
/// <summary> Checks if the password is valid </summary>
/// <param name="password">The password to be validated</param>
/// <returns>True if the password is valid, false otherwise</returns>
public bool IsPasswordValid(string password)
{
    Regex regex = new Regex(@"[a-z]{2,7}[1-9]{3,4}");
    var hasMatch = regex.IsMatch(password);
    return hasMatch;
}
```

Here the comments are pointless - they just tell the same things you can infer by looking at the method signature: this method checks if the input string is a valid password.

So, yes, those kinds of comments are totally meaningless, and they should be avoided.

## Good types of comments

But still, there are cases when writing comments is pretty helpful.

```cs
public bool IsPasswordValid(string password)
{
    // 2 to 7 lowercase chars followed by 3 or 4 numbers
    // Valid:   kejix173
    //          aoe193
    // Invalid: a92881
    Regex regex = new Regex(@"[a-z]{2,7}[1-9]{3,4}");
    return regex.IsMatch(password);
}
```

Here the purpose of the comment is not to explain what the method does (it's already pretty explicit), but it explains with examples the Regular Expression used to validate the password. **Another way to explain it is by adding tests** that validate some input strings. In this way, you make sure that the documentation (aka the tests) is always aligned with the production code.

By the way, for more complex calculations, adding comments explaining WHY (and not HOW or WHAT) a piece of code does is a good way to help developers understand the code.

Another reason to add comments is to explain why a specific piece of code exists: examples are legal regulations, related work items, or references to where you've found that particular solution.

## Conclusion

Always pay attention when writing comments: yes, they often just clutter the code. But they can really add value to the code, in some cases.

To read more about good and bad comments, here's a well-detailed article you might like:

🔗 [Clean code tips - comments and formatting](https://www.code4it.dev/blog/clean-code-comments-and-formatting "Clean code tips - comments and formatting | Code4IT")

Happy coding!

🐧
