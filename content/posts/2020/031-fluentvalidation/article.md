---
title: "Cool validation with FluentValidation"
path: "/blog/fluentvalidation"
tags: ["C#", ".NET"]
featuredImage: "./cover.jpg"
excerpt: "Validating inputs is crucial for every application. If you want an easy and versatile way, you can try FluentValidation."
created: 2020-06-16
updated: 2020-06-16
---

Needless to say, validating inputs is important. Invalid inputs may break your application and bring your system to an unstable state.

If you are working with Web API or MVC pages, you are probably used to validation attributes within the definition of the input class:

```cs
public class User
{
	[Required]
	public string FirstName { get; set; }
	
	[Required]
	public string LastName { get; set; }
}
```

That's not a bad approach, but today I want to give you an alternative: __FluentValidation__. This library allows you to define complex rules for object validation in a fluent way, making it easy to build and understand validation rules. You can find the project source on [GitHub](https://github.com/FluentValidation/FluentValidation "FluentValidation on GitHub") and read the documentation [on their website](https://fluentvalidation.net/ "FluentValidation website").

## Setting up the project

I'm going to use a simple Web API application in .NET Core. This application has only one endpoint for the registration of a user.

The input class for the endpoint is the User class that I've described before. I'm going to add additional fields and show how to validate them.

Of course, to use FluentValidation you must install it: if you are using the dotnet CLI, just run `dotnet add package FluentValidation` and `dotnet add package FluentValidation.AspNetCore` and you're ready to go!

## Creating your first validation

For every class you want to validate you must create its own validator. Each validator class must derive by `AbstractValidator<T>`, where T is the class to validate. All the validation rules are defined within the constructor.

The simplest validation is on null values. If you want to specify that both FirstName and LastName must not be empty, you can create this validator:

```cs
 public class UserValidator : AbstractValidator<User>
{
	public UserValidator()
	{
		RuleFor(x => x.FirstName).NotEmpty();
		RuleFor(x => x.LastName).NotEmpty();
	}
}
```

That's it! You have created your very first validator!

There are lots of predefined validators, like _MinimumLength_, _MaximumLength_ and _Length_ which, of course, validate the field length. Since you can add multiple validators to the same field, you can try this:

```cs
 public class UserValidator : AbstractValidator<User>
{
	public UserValidator()
	{
		RuleFor(x => x.FirstName).NotEmpty();
		RuleFor(x => x.FirstName).MinimumLength(3);
        RuleFor(x => x.FirstName).MaximumLength(20);
		
		RuleFor(x => x.LastName).NotEmpty();
	}
}
```

## Validating the input

Ok, we've defined the rules; it's time to try it with some real inputs! All you need to do is instantiate a new UserValidator object and __call the Validate method on it__. This method will return an object with info about the status of the validation and all the input that didn't pass the validation. So you can apply validation by doing something like this:

```cs
[HttpPost]
public IActionResult Register(User newUser)
{
	var validator = new UserValidator();
	var validationResult = validator.Validate(newUser);
	
	if (!validationResult.IsValid)
	{
		return BadRequest(validationResult.Errors.First().ErrorMessage);
	}

	return Ok();
}
```

If I run the program and I send an input with an invalid value for the first name

```json
{
    "FirstName": "Supercalifragilisticexpialidocious",
    "LastName": "Last name"
}
```

I'll get the validation error: _The length of 'First Name' must be 20 characters or fewer. You entered 34 characters._

But, you know what? I don't like that error message! I want to define one on my own!
Well, it's easy: I can add the `WithMessage` method to the builder:

```diff
- RuleFor(x => x.FirstName).MaximumLength(20);
+ RuleFor(x => x.FirstName).MaximumLength(20).WithMessage("Is your first name that long?? Really??");
```

## Concatenating checks

The rules NotEmpty and MinimumLength are so similar in the meaning, so maybe you'd like to refactor the code. But hey, this library is called FluentValidation, so it should be easy to think that you can concatenate those checks, right? Correct!

```diff
- RuleFor(x => x.FirstName).NotEmpty();
- RuleFor(x => x.FirstName).MinimumLength(3);
+ RuleFor(x => x.FirstName).NotEmpty().MinimumLength(3);
```

Also, you can add a Message to this new "contracted" definition. And, if you want, you can sum up everything in a single instruction:

```cs
public UserValidator()
{
	RuleFor(x => x.FirstName)
		.MaximumLength(20).WithMessage("Is your first name that long?? Really??")
		.NotEmpty().MinimumLength(3);

	RuleFor(x => x.LastName).NotEmpty();
}
```

## Other available checks

As I said, there are lots of out-of-the-box validators for base types: for strings you can use different methods, like _EmailAddress_, _IsEnumName_ (which checks if the value is defined in a specified Enum type) and _InclusiveBetween_, that checks if the value is within the defined range.

Now let me add two more fields to the User model: Password and ConfirmPassword.

The Password field is a string, and to be valid it must have a length between 5 and 15 chars and follow some security rules that will be checked using regular expressions. To define if the security rules are met, I've defined a HasValidPassword method that accepts a string input and returns a boolean.

```cs
private bool HasValidPassword(string pw)
{
	var lowercase = new Regex("[a-z]+");
	var uppercase = new Regex("[A-Z]+");
	var digit = new Regex("(\\d)+");
	var symbol = new Regex("(\\W)+");

	return (lowercase.IsMatch(pw) && uppercase.IsMatch(pw) && digit.IsMatch(pw) && symbol.IsMatch(pw));
}
```

Now it's easy to add these checks on the validation for the password:

```cs
RuleFor(x => x.FirstName)
	.MaximumLength(20).WithMessage("Is your first name that long?? Really??")
	.NotEmpty().MinimumLength(3);

RuleFor(x => x.LastName).NotEmpty();

RuleFor(x => x.Password)
	.Length(5, 15)
	.Must(x => HasValidPassword(x));
```

The _Must_ method accepts a `Function<T, bool>`. We can also simplify the call by specifying only the name of the method like we can do with delegates:

```diff
		RuleFor(x => x.Password)
			.Length(5, 15)
-			.Must(x => HasValidPassword(x));
+			.Must(HasValidPassword);
	}
```

The only requirement for the ConfirmPassword is to be equal to the Password field:

```cs
 RuleFor(x => x.ConfirmPassword)
	.Equal(x => x.Password)
	.WithMessage("Passwords must match");
```

You can do more than this, obviously. For instance, if you have nested objects, you can add a specific validator for that field. Everything is well described in the [FluentValidation documentation page](https://docs.fluentvalidation.net/en/latest/start.html#complex-properties "Validating complex properties").

## Many ways to use the validator

There are many ways to add validate inputs on .NET Core APIs. How to add it depends on your project and on your preferences.

### Instantiate a new validator every time

As we've seen, the simplest way to use the UserValidator class is to create a new instance of the validator and run call the Validate method on the input.

```cs
[HttpPost]
public IActionResult Register(User newUser)
{
	var validator = new UserValidator();
	var validationResult = validator.Validate(newUser);
	
	if (!validationResult.IsValid)
	{
		return BadRequest(validationResult.Errors.First().ErrorMessage);
	}

	return Ok();
}
```

It's a long-winded way, but it's the easiest way to use it. Also, you have complete freedom of choice about the format of the returned message (here I chose to return only the ErrorMessage for the first error, but you can return all the info stored in the Errors field).

### Inject the validator in the constructor

A better way is to register the dependencies on the Startup class and use them in the constructor:

```cs
public void ConfigureServices(IServiceCollection services)
	{
		services.AddControllers();

		services.AddTransient<IValidator<User>, UserValidator>();
	}
```

So now in the Controller constructor we can inject an `IValidator<User>` dependency and use it in the Register method.

Honestly, this is my favorite approach, since it is flexible and highly testable.

_Notice that the dependency lifetime is Transient. Wanna know more about Transient, Singleton and Scoped? Here's my article about [Dependency Injection lifetimes](./dependency-injection-lifetimes "Dependency Injection lifetimes in .NET")!_

### Add single validator in the request pipeline

By adding `AddFluentValidation()` in the ConfigureServices method you can validate inputs __before calling the Register method__.

```cs
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers().AddFluentValidation();

	services.AddTransient<IValidator<User>, UserValidator>();
}
```

An advantage of this approach is that you have cleaner methods because the validation is always in place:

```cs
[HttpPost]
public IActionResult Register(User newUser)
{
	return Ok();
}
```

The downside is that, as far as I know, you can only get the whole object that contains failed checks instead of having customizable return messages: by calling the Register endpoint with the following input

```json
{
    "FirstName": "Supercalifragilisticexpialidocious",
    "LastName": "Last name"
}
```

you'll get the error messages in this format:

```json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "|c4523c02-4899b7f3df86a629.",
    "errors": {
        "Password": [
            "'Password' must not be empty."
        ],
        "FirstName": [
            "Is your first name that long?? Really??"
        ]
    }
}
```

### Register all the validators in the assembly

If you have lots of validators, you might want to register all of them in an easy way.

```cs
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers()
			.AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<UserValidator>());
}
```

The `RegisterValidatorsFromAssemblyContaining` checks for all the validators defined within the same assembly of the UserValidator class and automatically adds all of them to your APIs.

Again, I don't like this way so much since I couldn't find a way to customize outputs.

## Conclusion

That's it! We have seen a great library for validating inputs which is easy to understand and highly customizable.

If you want to try it, just head to my [GitHub project](https://github.com/code4it-dev/FluentValidationExample "GitHub repo for this article")!

Do you know any other ways to validate inputs?

Happy coding!