---
title: "Solving type or namespace not found in .NET Core"
path: "/blog/dotnet-type-or-namespace-not-found"
tags: [".NET"]
featuredImage: "./cover.jpg"
excerpt: "Error CS0246 - Type or namespace could not be found. What does it mean? Why does it happen? How can you solve it?"
created: 2019-08-26
updated: 2019-08-26
---

Something strange happened today.

I've developed a Class Library in .NET Framework and I tested it with the related test library.

So I've integrated the library into another project. Everything was fine, I used that library without problems. 
But, all of a sudden:

_Error CS0246: The type or namespace name 'XX' could not be found (are you missing a using directive or an assembly reference?)._

__What?!?__ I've been using it for the whole week. I've tested it. I've added the reference, and the Intellisense works as well.

C'mon, the class is here!

Clean the solution... nothing happens.

Close Visual Studio... still nothing.

Have a coffee... well, better now.

Suddenly, a doubt: _what if I've created it in .NET Core instead of .NET Framework?_

And, obviously... no, it wasn't that.

But I was close: the Class Library was in _.NET Framework 4.7.2_ but the application was in _.NET Framework 4.7.1_. __It was the patch version!__

So, I just downgraded the class library version through Visual Studio, and everything went well again.

You can find the version in the Properties screen of the project (right-click on the project in the Solution Explorer or _Alt+Enter_), in the _Application_ tab, then under the _Target framework_ field.

![.NET version selection on Visual Studio 2019](https://res.cloudinary.com/bellons/image/upload/t_content-image/Code4IT/Articles/2019/assembly-not-found/dotnet-version-selector.png "How to select .NET version on Visual Studio 2019")

So, the lesson is: _know your enemy_, and check for the slight details.
