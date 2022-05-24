---
title: "Clean Code Tip: Tests should be even more well-written than production code"
path: '/cleancodetips/tests-should-be-readable-too'
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Should you write your tests with the same care you write the production code? Of course you should! But what does it mean?"
created: 2022-05-24
updated: 2022-05-24
---

You surely take care of your code to make it easy to read and understand, right? RIGHT??

Well done! 👏

But most of the developers tend to write good production code (the one actually executed by your system), but very poor test code.

**Production code is meant to be run, while tests are also meant to document your code**; therefore there must not be doubts about the meaning and the reason behind a test.
This also means that all the names must be explicit enough to help readers understand **how** and **why** a test should pass.

This is a valid C# test:

```cs
[Test]
public void TestHtmlParser()
{
    HtmlDocument doc = new HtmlDocument();
    doc.LoadHtml("<p>Hello</p>");
    var node = doc.DocumentNode.ChildNodes[0];
    var parser = new HtmlParser();

    Assert.AreEqual("Hello", parser.ParseContent(node));
}
```

What is the meaning of this test? We should be able to understand it just by reading the method name.

Also, notice that here we are creating the HtmlNode object; imagine if this node creation is present in every test method: you will see the same lines of code over and over again. 

Thus, we can refactor this test in this way:

```cs
 [Test]
public void HtmlParser_ExtractsContent_WhenHtmlIsParagraph()
{
    //Arrange
    string paragraphContent = "Hello";
    string htmlParagraph = $"<p>{paragraphContent}</p>";
    HtmlNode htmlNode = CreateHtmlNode(htmlParagraph);
    var htmlParser = new HtmlParser();
    
    //Act
    var parsedContent = htmlParser.ParseContent(htmlNode);

    //Assert
    Assert.AreEqual(paragraphContent, parsedContent);
}
```

This test is definitely better:

* you can understand its meaning by reading the test name
* the code is concise, and some creation parts are refactored out
* we've well separated the 3 parts of the tests: Arrange, Act, Assert (we've already talked about it [here](https://www.code4it.dev/cleancodetips/aaa-pattern-for-tests/ "AAA pattern for tests: why is it important?"))

## Wrapping up

Tests are still part of your project, even though they are not used directly by your customers.

Never skip tests, and never write them in a rush. After all, when you encounter a bug, the first thing you should do is write a test to reproduce the bug, and then validate the fix using that same test. 

So, keep writing good code, for tests too!

Happy coding!

🐧
