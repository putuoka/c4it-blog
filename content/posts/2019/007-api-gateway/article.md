---
title: "API Gateways - an overview"
path: "/blog/overview-api-gateways"
tags: ['API Gateway', 'Ocelot', ] 
featuredImage: "./cover.jpg"
excerpt: "API Gateways can help you create microservices and micro frontends, and expose rich APIs to your customers while keeping things simple on your company."
created: 2019-05-17
updated: 2019-05-17
---

When creating complex systems, it is important to have the possibility to develop the functionalities in a simple way but expose those functionalities in a coherent way.

Also, for big organizations, it can happen that a team is used to work on the .NET stack, while another works on Java or Node.js. But, if you are exposing APIs to clients, it's important to hide implementation details.

__API Gateways__ allow you to create services with completely different technologies: since one of the best practices is to have all the APIs detached from the others, having __different stacks__ is definitely not a problem. Considering that those services can live on their own, you can make them very small and provide __common functionalities at API Gateway level__: examples are documentation, error handling, authentication, and general logging. 

There are different services that provide different complexity at different prices, like [Azure API Management](https://azure.microsoft.com/en-us/services/api-management/ "Azure API Management reference"), [Amazon API Gateway](https://aws.amazon.com/api-gateway/ "Amazon AWS API Gateway reference"), and [Ocelot](https://github.com/ThreeMammals/Ocelot "Ocelot repository").

## UI Composition

An interesting thing to do with API Gateways is UI Composition.

Imagine that you must show info that comes from different services, for example, the list of available products with few details about the product itself and info about the seller. You can handle this problem in 3 ways:

1. call an API to get the list of all products and then call, for each product, another API to get the additional info, doing those operations directly from the client;
2. create a single API function that returns all the info;
3. use a Gateway that deals with all the operations from the backend and then returns the result as requested by the client.

Method #1 is, of course, the slowest from the client's perspective. #2 is probably the most used in monolithic applications. #3 is optimal for microservice-based applications, considering that those microservices should return the minimum results possible to avoid over-engineering. 

## Ocelot

If you want to try API Gateways for a simple project, I recommend you to have a look at [Ocelot](https://github.com/ThreeMammals/Ocelot "Ocelot GitHub link"). It is an __open source project__ that supports .NET Core. You can find the documentation [here](https://ocelot.readthedocs.io/en/latest/ "Ocelot documentation").

It is an interesting project, easy to use, and great to have an idea of what an API Gateway is. The definition of exposed functions is defined through a JSON file, which defines available routes and additional customizations.

Among its capabilities, you can handle routing, authorization and authentication, logging, and load balancing.

## Workaround for hiding public APIs

APIs, being available through the web, are by default discoverable (obviously excluding those on an intranet). But you might want to "hide" endpoints and provide access only to API Gateways. How can you do this? 

There's a quick and dirty workaround: insert a GUID in the URL. So if you want to obscure this endpoint:

_http://mysite.com/api/users/getById_

you can modify the URL like this: 

_http://mysite.com/api/07ec5ecc-46db-4a5b-9000-c994792f364b/users/getById_

This way the APIs are available online but not easily discoverable.

I know, this workaround is dirty. Personally, I don't like it, but it works.

## SSL Termination

Since an API Gateway sits in front of your backend, a nice idea is to implement SSL Termination here. But... __what is SSL Termination__? Let's take a step back.
When you secure your website with SSL you send encrypted data "on the wire" and decrypt and verify the message on the endpoints. This means that every time you request a resource from a server, the request must be decrypted before usage. __Decryption is an intensive process__, and server resources will be used not only to elaborate the request but also to decrypt the message, slowing down the entire process. 

With SSL Termination you move the burden of decryption from the server to the load balancer, or in this case the Gateway. This means that when a request is done, the server "in the middle" decrypts the message, sends the plain message to the server that will do less work. 

Another advantage of this technique is the simplified management of SSL certificates: while before you had to install that on each server, now you can use it only on the "exposed" endpoint.

Of course, when the internal servers are on the same LAN there are more advantages.

## Final words

API Gateways are useful when you have to share APIs with external clients, but for a simple application, I think they add more difficulties than benefits. However, looking at the microservices world, a basic knowledge of this kind of technology is fundamental to create a scalable architecture.
