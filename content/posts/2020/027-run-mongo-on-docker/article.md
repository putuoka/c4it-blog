---
title: "First steps with Docker: download and run MongoDB locally"
path: "/blog/run-mongodb-on-docker"
tags: ["Docker", "MongoDB" , "MainArticle"]
featuredImage: "./cover.jpg"
excerpt: "Docker is a project that allows you to create and run applications in an isolated environment. Let's try it to run MongoDB on your machine!"
created: 2020-05-12
updated: 2020-05-12
---

In this article, I'm going to explain how you can try out the functionalities of __MongoDB__ without installing it, but running it on a __Docker__ container. First of all, I'll explain what is Docker and what it can do for us; then we'll run MongoDB on a Docker container.

## Docker

You've probably heard of Docker: it is an open-source project that allows developers to __run, create and distribute unit of software__ in a standardized way; it works with _containers_, that, simplifying a lot, are isolated applications with their own file systems and that can be run anywhere: think of them as VMs, but with a different and lighter underlying structure.

First of all, you must install Docker on your machine. You can refer to the [Getting Started page on the project's website](https://www.docker.com/get-started "Docker installation page") to know how to download and install it.

But, first, let me introduce the key concepts to know about Docker:  _images_ and _containers_.

### Docker images

__Images are the blueprints__ that contain all the information to run a container. Do you remember _snapshots_ from the VM world? Well, images are the same for containers: a set of instructions and file system layers that, when executed, allow your container to be alive.

Most of the images are available on [DockerHub](https://hub.docker.com/ "DockerHub link"): this is a library of official images of various types, from databases to frameworks, from operating systems to cache platforms.

There are few commands to know when working with images:

* `docker pull <image-name>` downloads the specified image from Docker Hub;
* `docker image ls` lists all the downloaded images stored on your machine;
* `docker rmi <image-name>` removes the specified image from your machine;

### Docker containers

__Containers are the living versions__ of an image.

Once you have downloaded an image, you can "build" it to have your container up and running:

* `docker run <image-name>` creates and runs a container using the specified image;
* `docker ps` lists all the containers currently up;
* `docker ps -a` lists all the containers, also the ones stopped;
* `docker stop <container-name>` stops the specified container;
* `docker rm <container-name>` stops and removes the specified container;

So now we have our container accessible within the machine. But we haven't finished yet!

### Docker containers ports

Once the container is up and running, it exposes one or more ports (for example, the container for an API may expose port 80). But __that ports belong to the container!__ Since we need to access the container from our _localhost_, we need to map a local port to one of the ports exposed by the container.

If the container exposes the port 80, we can run `docker run -p 8089:80 image-name`. The `-p` flag maps the external and the internal ports, allowing us to access the container navigating to _localhost:8089_.

![How port mapping works](./Docker-ports.png "Docker port mapping")

## MongoDB

MongoDB is a document-based database. Just like you have tables and relations in a relational database, for document databases the focus is on documents: those are dynamic structures, meaning that they don't have a strict schema, but can be extended as you wish.
__MongoDB stores documents in a JSON format__; for example, this is a valid document:

```json
{
  "_id": "5cf0029caff5056591b0ce7d",
  "firstname": "Davide",
  "lastname": "Bellone",
  "address": {
    "city": "Turin",
    "country": "Italy",
  },
  "hobbies": [ "coding", "music", "blogging" ]
}
```

Documents are stored inside _collections_ that represent, well, collections of documents! Obvious, isn't it? 😊
Usually, collections are meant to group similar documents, such as users, books, and so on.

Do you want to try it? Maybe without installing it? Here's where Docker comes in handy.

## Running MongoDB on Docker

The first step is to download the [official MongoDB image](https://hub.docker.com/_/mongo "MongoDB image on DockerHub") using the terminal:

```docker
docker pull mongo
```

![docker pull mongo result](./docker-pull-mongo.png "docker pull mongo result")

We can check the details of this image by running `docker image inspect mongo`: this command will list all the properties of this image; we can see, looking at the _ContainerConfig.ExposedPorts_ field, that we can reach Mongo through port 27017.

![exposed port](./mongo-exposed-port.png "exposed port")

So now we are ready to run this container with this command:

```docker
docker run -d  --name mongo-on-docker  -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
```

It looks complicated, right? Let me explain every part:

* `docker run` runs the image and starts the container;
* `-d` runs the container in background, so that we are free to use the current terminal instance;
* `--name mongo-on-docker` defines a friendly name for the container;
* `-p 27888:27017` declares that the local port 27888 is mapped to the internal 27017 port;
* `-e MONGO_INITDB_ROOT_USERNAME=mongoadmin` sets the root username (`-e` sets the environment variables);
* `-r MONGO_INITDB_ROOT_PASSWORD=secret` sets the root password;
* `mongo` is the name of the image to run;

That's it! Now you have your MongoDB instance up and running without having it installed directly on your machine!

It's time to try it: create your connection string with this format: `mongodb://<username>:<password>@<host>:<port>/?authSource=admin`. You will get `mongodb://mongoadmin:secret@localhost:27888/?authSource=admin`.

Now, if you have a tool for exploring MongoDB, open it and connect to the newly created Mongo instance. If you use _NoSQLBooster for MongoDB_ you will see something like this:

![MongoDB instance](./mongo-connection-tree.png "MongoDB instance")

Finally, you can create a new DB (I've called it _tests_) and try MongoDB.

## Wrapping up

Thanks to Docker now it's possible to run many platforms on your local machine without installing them. You can use Docker for many other purposes, like creating your own images and container, organize and connect them, and many other cool stuff.

Happy coding!
