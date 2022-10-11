---
title: "3 ways to check the object passed to mocks with Moq in C#"
path: "/blog/check-objects-called-mocks-in-moq"
tags: ["CSharp", "Testing", "MainArticle"]
featuredImage: "./cover.png"
excerpt: "In unit tests, sometimes you need to perform deep checks on the object passed to the mocked service. We will learn 3 ways to do that with Moq and C#"
created: 2022-05-17
updated: 2022-05-17
---

When writing unit tests, you can use Mocks to simulate the usage of class dependencies.

Even though some developers are harshly against the usage of mocks, they can be useful, especially when the mocked operation does not return any value, but still, you want to check that you've called a specific method with the correct values.

In this article, we will learn 3 ways to check the values passed to the mocks when using Moq in our C# Unit Tests.

To better explain those 3 ways, I created this method:

```cs
public void UpdateUser(User user, Preference preference)
{
    var userDto = new UserDto
    {
        Id = user.id,
        UserName = user.username,
        LikesBeer = preference.likesBeer,
        LikesCoke = preference.likesCoke,
        LikesPizza = preference.likesPizza,
    };

    _userRepository.Update(userDto);
}
```

`UpdateUser` simply accepts two objects, `user` and `preference`, combines them into a single `UserDto` object, and then calls the `Update` method of `_userRepository`, which is an interface injected in the class constructor.

As you can see, we are not interested in the return value from `_userRepository.Update`. Rather, we are interested in checking that we are calling it with the right values.

We can do it in 3 ways.

## Verify each property with It.Is

The simplest, most common way is by using `It.Is<T>` within the `Verify` method.

```cs
[Test]
public void VerifyEachProperty()
{
    // Arrange
    var user = new User(1, "Davide");
    var preferences = new Preference(true, true, false);

    UserDto expected = new UserDto
    {
        Id = 1,
        UserName = "Davide",
        LikesBeer = true,
        LikesCoke = false,
        LikesPizza = true,
    };

    //Act

    userUpdater.UpdateUser(user, preferences);

    //Assert
    userRepo.Verify(_ => _.Update(It.Is<UserDto>(u =>
        u.Id == expected.Id
        && u.UserName == expected.UserName
        && u.LikesPizza == expected.LikesPizza
        && u.LikesBeer == expected.LikesBeer
        && u.LikesCoke == expected.LikesCoke
    )));
}
```

In the example above, we used `It.Is<UserDto>` to check the exact item that was passed to the `Update` method of `userRepo`.

Notice that it accepts a parameter. That parameter is of type `Func<UserDto, bool>`, and you can use it to define when your expectations are met.

In this particular case, we've checked each and every property within that function:

```cs
u =>
    u.Id == expected.Id
    && u.UserName == expected.UserName
    && u.LikesPizza == expected.LikesPizza
    && u.LikesBeer == expected.LikesBeer
    && u.LikesCoke == expected.LikesCoke
```

This approach works well when you have to perform checks on only a few fields. But the more fields you add, the longer and messier that code becomes.

Also, a problem with this approach is that if it fails, it becomes hard to understand which is the cause of the failure, because **there is no indication of the specific field** that did not match the expectations.

Here's an example of an error message:

```
Expected invocation on the mock at least once, but was never performed: _ => _.Update(It.Is<UserDto>(u => (((u.Id == 1 && u.UserName == "Davidde") && u.LikesPizza == True) && u.LikesBeer == True) && u.LikesCoke == False))

Performed invocations:

Mock<IUserRepository:1> (_):
    IUserRepository.Update(UserDto { UserName = Davide, Id = 1, LikesPizza = True, LikesCoke = False, LikesBeer = True })

```

Can you spot the error? And _what if you were checking 15 fields instead of 5_?

## Verify with external function

Another approach is by externalizing the function.

```cs
[Test]
public void WithExternalFunction()
{
    //Arrange
    var user = new User(1, "Davide");
    var preferences = new Preference(true, true, false);

    UserDto expected = new UserDto
    {
        Id = 1,
        UserName = "Davide",
        LikesBeer = true,
        LikesCoke = false,
        LikesPizza = true,
    };

    //Act
    userUpdater.UpdateUser(user, preferences);

    //Assert
    userRepo.Verify(_ => _.Update(It.Is<UserDto>(u => AreEqual(u, expected))));
}

private bool AreEqual(UserDto u, UserDto expected)
{
    Assert.AreEqual(expected.UserName, u.UserName);
    Assert.AreEqual(expected.Id, u.Id);
    Assert.AreEqual(expected.LikesBeer, u.LikesBeer);
    Assert.AreEqual(expected.LikesCoke, u.LikesCoke);
    Assert.AreEqual(expected.LikesPizza, u.LikesPizza);

    return true;
}
```

Here, we are passing an external function to the `It.Is<T>` method.

This approach allows us to define more explicit and comprehensive checks.

The good parts of it are that you will gain **more control over the assertions**, and you will also have **better error messages** in case a test fails:

```
Expected string length 6 but was 7. Strings differ at index 5.
Expected: "Davide"
But was:  "Davidde"
```

The bad part is that you will stuff your test class with lots of different methods, and the class can easily become hard to maintain. Unluckily, **we cannot use local functions.**

On the other hand, having external functions allows us to combine them when we need to do some tests that can be reused across test cases.

## Intercepting the function parameters with Callback

Lastly, we can use a hidden gem of Moq: **Callbacks**.

With Callbacks, **you can store in a local variable the reference** to the item that was called by the method.

```cs
[Test]
public void CompareWithCallback()
{
    // Arrange

    var user = new User(1, "Davide");
    var preferences = new Preference(true, true, false);

    UserDto actual = null;
    userRepo.Setup(_ => _.Update(It.IsAny<UserDto>()))
        .Callback(new InvocationAction(i => actual = (UserDto)i.Arguments[0]));

    UserDto expected = new UserDto
    {
        Id = 1,
        UserName = "Davide",
        LikesBeer = true,
        LikesCoke = false,
        LikesPizza = true,
    };

    //Act
    userUpdater.UpdateUser(user, preferences);

    //Assert
    Assert.IsTrue(AreEqual(expected, actual));
}
```

In this way, you can use it locally and run assertions directly to that object without relying on the `Verify` method.

Or, **if you use records**, you can use the auto-equality checks to simplify the `Verify` method as I did in the previous example.

## Wrapping up

In this article, we've explored 3 ways to perform checks on the objects passed to dependencies mocked with Moq.

Each way has its pros and cons, and it's up to you to choose the approach that fits you the best.

I personally prefer the second and third approaches, as they allow me to perform better checks on the passed values.

What about you?

For now, happy coding!

🐧
