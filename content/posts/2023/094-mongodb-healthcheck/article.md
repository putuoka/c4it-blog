---
title: "How to add Health Checks in .NET to check communication with MongoDB"
path: "/blog/mongodb-healthcheck"
tags: ["MainArticle"]
featuredImage: "./cover.png"
excerpt: "a description for 094-mongodb-healthcheck"
created: 4219-11-20
updated: 4219-11-20
---

In any complex system, you have to deal with external dependencies.

More often than not, if one of the external systems, such as a database, another API, or an authentication provider, is down, your whole system might be affected.

In this article, we're going to learn what Health Checks are, how to create custom ones, and how to check whether a MongoDB instance can be reached or not.

## What is Health Check


## Adding custom Health Checks in dotNET


builder.Services.AddHealthChecks()

app.MapHealthChecks("/healthz");



```cs

public class CustomHealthCheck : IHealthCheck
{
    private readonly IConfiguration _config;

    public CustomHealthCheck(IConfiguration config)
    {
        _config = config;
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var isHealthy = true;

        // ...

        if (isHealthy)
        {
            return Task.FromResult(
                HealthCheckResult.Healthy("A healthy result."));
        }

        return Task.FromResult(
            new HealthCheckResult(
                context.Registration.FailureStatus, "An unhealthy result."));
    }
}
```


```cs

builder.Services.AddHealthChecks()
     .AddCheck<CustomHealthCheck>("Custom");
```

PROVA

## Adding a custom Health Check Provider for MongoDB


## Using AspNetCore.Diagnostics.HealthChecks

AspNetCore.Diagnostics.HealthChecks isn't maintained or supported by Microsoft.


## Why do we even need a custom provider?



<content>

```cs
private async Task<bool> MongoCheck()
{
    var url = new MongoUrl(_frontEndStoreConfiguration.ConnectionString);

    var ping = await new MongoClient(url)
        .GetDatabase(url.DatabaseName)
        .WithReadPreference(new ReadPreference(ReadPreferenceMode.Secondary))
        .RunCommandAsync<BsonDocument>(new BsonDocument { { "ping", 1 } });

    if (!ping.TryGetValue("ok", out var ok) || (!ok.IsDouble || Math.Abs(ok.AsDouble - 1d) >= double.Epsilon) && (!ok.IsInt32 || ok.AsInt32 != 1))
    {
        _logger.Error("{ClassName}.{Method} Mongo DB check failed",
            ClassName, nameof(MongoCheck));

        return false;
    }

    return true;
}
```

## Further readings

<links>

*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*
https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-7.0
## Wrapping up

<Conclusion>

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛 

Happy coding!

🐧

## APPUNTI

[ ] Check grammar

[ ] Check titles

[ ] Alt text

[ ] Check bold/italics

[ ] Check frontmatter
