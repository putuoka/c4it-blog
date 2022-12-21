---
title: "Clean Code Tip: Methods should have a coherent level of abstraction"
path: "/cleancodetips/coherent-levels-of-abstraction"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Don't let the reader get lost in the code details!"
created: 2022-11-15
updated: 2022-11-15
---

Mixed levels of abstraction make the code harder to understand.

At the first sight, the reader should be able to understand what the code does without worrying about the details of the operations.

Take this code snippet as an example:

```cs
public void PrintPriceWithDiscountForProduct(string productId)
{
    var product = sqlRepository.FindProduct(productId);
    var withDiscount = product.Price * 0.9;
    Console.WriteLine("The final price is " + withDiscount);
}
```

We are mixing multiple levels of operations. In the same method, we are

- integrating with an external service
- performing algebraic operations
- concatenating strings
- printing using .NET Console class

Some operations have a high level of abstraction (call an external service, I don't care how) while others are very low-level (calculate the price discount using the formula _ProductPrice\*0.9_).

Here the readers lose focus on the overall meaning of the method because they're distracted by the actual implementation.

> When I'm talking about _abstraction_, I mean how high-level an operation is: the more we stay away from bit-to-bit and mathematical operations, the more our code is abstract.

Cleaner code should let the reader understand what's going on without the need of understanding the details: if they're interested in the details, they can just read the internals of the methods.

We can improve the previous method by splitting it into smaller methods:

```cs
public void PrintPriceWithDiscountForProduct(string productId)
{
    var product = GetProduct(productId);
    var withDiscount = CalculateDiscountedPrice(product);
    PrintPrice(withDiscount);
}

private Product GetProduct(string productId)
{
    return sqlRepository.FindProduct(productId);
}

private double CalculateDiscountedPrice(Product product)
{
    return product.Price * 0.9;
}

private void PrintPrice(double price)
{
    Console.WriteLine("The final price is " + price);
}
```

Here you can see the different levels of abstraction: the operations within `PrintPriceWithDiscountForProduct` have a coherent level of abstraction: they just tell you what the steps performed in this method are; all the methods describe an operation at a high level, without expressing the internal operations.

Yes, now the code is much longer. But we have gained some interesting advantages:

- readers can focus on the "what" before getting to the "how";
- we have more reusable code (we can reuse `GetProduct`, `CalculateDiscountedPrice`, and `PrintPrice` in other methods);
- if an exception is thrown, we can easily understand where it happened, because we have more information on the stack trace.

You can read more about the latest point here:

🔗 [Clean code tip: small functions bring smarter exceptions | Code4IT](https://www.code4it.dev/cleancodetips/smaller-functions-smarter-exceptions)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Happy coding!

🐧
