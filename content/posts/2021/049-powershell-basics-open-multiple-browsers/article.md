---
title: "How to open the same URL on different environments with PowerShell"
path: "/blog/powershell-basics-open-multiple-browsers"
tags: ["PowerShell", "MISC", "MainArticle"]
featuredImage: "./cover.jpg"
excerpt: "Revise PowerShell basics with a simple script that opens a browser for each specified URL. We're gonna cover how to declare variables, define arrays, concatenate strings and run CMD commands."
created: 2021-01-26
updated: 2021-01-26
---

Say that your project is already deployed on multiple environments: dev, UAT, and production; now you want to open the same page from all the environments.

You could do it manually, by composing the URL on a notepad. Or you could create a PowerShell script that opens them for you.

In this article, I'm going to share with you a simple script to open multiple browsers with predefined URLs. First of all, I'll show you the completed script, then I'll break it down to understand what's going on and to brush up on some basic syntax for PowerShell.

## Understanding the problem: the full script

I have a website deployed on 3 environments: dev, UAT, and production, and I want to open all of them under the same page, in this case under _"/Image?w=60"_.

So, here's the script that opens 3 instances of my default browser, each with the URL of one of the environments:

```powershell
$baseUrls =
"https://am-imagegenerator-dev.azurewebsites.net",
"https://am-imagegenerator-uat.azurewebsites.net",
"https://am-imagegenerator-prd.azurewebsites.net";

$path = "/Image?w=600";

foreach($baseUrl in $baseUrls)
{
    $fullUrl = "$($baseUrl)$($path)";
    Invoke-Expression "cmd.exe /C start $($fullUrl)"
}

```

Let's analyze the script step by step to brush up on some basic notions about PowerShell.

## Variables in PowerShell

The first thing to notice is the way to declare variables:

```powershell
$path = "/Image?w=600";
```

There's not so much to say, except that **variables have no type declaration** and that **each variable name must start with the "$" symbol**.

## Arrays in PowerShell

Talking about arrays, we can see that there is no `[]` syntax:

```powershell
$baseUrls =
    "https://am-imagegenerator-dev.azurewebsites.net",
    "https://am-imagegenerator-uat.azurewebsites.net",
    "https://am-imagegenerator-prd.azurewebsites.net";
```

In fact, to declare an array you must simply separate each string with `,`.

## Foreach loops in PowerShell

Among the other loops (`while`, `do-while`, `for`), the `foreach` loop is probably the most used.

Even here, it's really simple:

```powershell
foreach($baseUrl in $baseUrls)
{

}
```

As we've already seen before, there is no type declaration for the _current_ item.

Just like C#, the keyword used in the body of the loop definition is `in`.

```cs
foreach (var item in collection)
{
    // In C# we use the `var` keyword to declare the variable
}
```

## String concatenation in PowerShell

The `$fullUrl` variable is the concatenation of 2 string variables: `$baseUrl` and `$path`.

```powershell
$fullUrl = "$($baseUrl)$($path)";
```

We can see that to declare this new string we must wrap it between `"..."`.

More important, every variable that must be interpolated is wrapped in a `$()` block.

## How to run a command with PowerShell

The key part of this script is for sure this line:

```powershell
Invoke-Expression "cmd.exe /C start $($fullUrl)"
```

The `Invoke-Expression` cmdlet evaluates and runs the specified string in your local machine.

The command `cmd.exe /C start $($fullUrl)` just tells the CMD to open the link stored in the `$fullUrl` variable with the default browser.

## Wrapping up

We learned how to open multiple browser instances with PowerShell. As you can understand, this was just an excuse to revise some basic concepts of PowerShell.

I think that many of us are too focused on our main language (C#, Java, JavaScript, and so on) that we forget to learn something different that may help us with our day-to-day job.

Happy coding!
