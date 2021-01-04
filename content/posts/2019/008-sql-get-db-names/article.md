---
title: "Have you ever forgotten your SQL server instance name?"
path: "/blog/ssms-how-to-get-instance-name"
tags: ['SQL', 'SSMS', 'DB']
featuredImage: "./cover.jpg"
excerpt: "Sometimes, when I open SQL Server Management Studio, I forget about my Local DB instance name. Here's how to retrieve it."
created: 2019-05-21
updated: 2019-05-21
---

This article is just a note for something I forget the most: my LocalDB instance names.

Sometimes when I open __SQL Server Management Studio__ (SSMS) I lose time thinking and trying to figure out what is the name of my LocalDb.

The solution is simple: open the terminal and run `SQLLocalDb.exe i`, where _i_ stand for _information_.

Now you can see the list of configured DBs.

![SQLLocalDb.exe i result](https://res.cloudinary.com/bellons/image/upload/t_content-image/Code4IT/Articles/2019/ssms-find-instance-name/ssms_result.png "SQLLocalDb result")

__To use it in SSMS remember to use Windows Authentication.__

If you need more info about a specific instance, just run `SQLLocalDB.exe i "InstanceName"` where of course _InstanceName_ must be replaced with the real name you are looking for.

This command displays some info about the specified SQL instance: this info includes the version, the owner and the current state.

![SQL instance details](https://res.cloudinary.com/bellons/image/upload/t_content-image/Code4IT/Articles/2019/ssms-find-instance-name/ssms_instance_details.png "SQL instance details")

If you want to have a list of all available commands, run `SQLLocalDB.exe -?`. These commands allow you to create and delete SQL instances, stop and start existing instances and so on.

![SQLLocalDB command options](https://res.cloudinary.com/bellons/image/upload/t_content-image/Code4IT/Articles/2019/ssms-find-instance-name/ssms_command_help.png "SQLLocalDb command options")

It's important to remember that here the spaces are treated as delimiters, so if your DB includes spaces inside its name, you must surround the name with quotes.
