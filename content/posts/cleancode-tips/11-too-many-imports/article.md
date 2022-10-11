---
title: "Clean Code Tip: Avoid using too many Imports in your classes"
path: "/cleancodetips/too-many-imports"
tags: ["Clean Code", "Clean Code Tip"]
featuredImage: "./cover.png"
excerpt: "Having too many 'using's, or imports, is a good indicator that your class does too many things. You should work to reduce the number of dependencies of a class."
created: 2022-04-19
updated: 2022-04-19
---

Actually, this article is not about a tip to write cleaner code, but it is an article that aims at pointing out a code smell.

Of course, once you find this code smell in your code, you can act in order to eliminate it, and, as a consequence, you will end up with cleaner code.

The code smell is easy to identify: open your classes and have a look at the imports list (in C#, the `using` on top of the file).

## A real example of too many imports

Here's a real-life example (I censored the names, of course):

```cs
using MyCompany.CMS.Data;
using MyCompany.CMS.Modules;
using MyCompany.CMS.Rendering;
using MyCompany.Witch.Distribution;
using MyCompany.Witch.Distribution.Elements;
using MyCompany.Witch.Distribution.Entities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using MyProject.Controllers.VideoPlayer.v1.DataSource;
using MyProject.Controllers.VideoPlayer.v1.Vod;
using MyProject.Core;
using MyProject.Helpers.Common;
using MyProject.Helpers.DataExplorer;
using MyProject.Helpers.Entities;
using MyProject.Helpers.Extensions;
using MyProject.Helpers.Metadata;
using MyProject.Helpers.Roofline;
using MyProject.ModelsEntities;
using MyProject.Models.ViewEntities.Tags;
using MyProject.Modules.EditorialDetail.Core;
using MyProject.Modules.VideoPlayer.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace MyProject.Modules.Video
```

Sounds familiar?

If we exclude the imports necessary to use some C# functionalities

```cs
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
```

We have lots of dependencies on external modules.

This means that if something changes in one of the classes that are part of those namespaces, we may end up with code that is difficult to update.

[![Class dependencies](https://mermaid.ink/img/pako:eNqF0j1rwzAQBuC_Ym5SIPHQr8FDoXUcSolLaKAd6g7COtsqss5IZ1oT8t-rQEoTMkiT0Ps-p-V2UJNCyKB1cuiS9Wtlk3AePspp4-gLa05LUqNB_5ksFvfJoyinnPpB2inNy-0sUs9P6u-a6y4GlqLUtSNPDafFD6P1mqxP19S22rYxXYgX_OYADvzZk42BlfgPcrLsyBh0Pn3TCmlj5IQuOuLqbIbDKLg-AU9ohvBh1NyIswSNLyxr1hintxc0Su7ERXI0CcyhR9dLrcLS7A6PFXCHPVaQhavCRo6GK6jsPlTHQUnGQmkmB1kjjcc5yJFpO9kaMnYj_pWWWoYd7I-t_S_dxt3C)](https://mermaid.live/edit#pako:eNqF0j1rwzAQBuC_Ym5SIPHQr8FDoXUcSolLaKAd6g7COtsqss5IZ1oT8t-rQEoTMkiT0Ps-p-V2UJNCyKB1cuiS9Wtlk3AePspp4-gLa05LUqNB_5ksFvfJoyinnPpB2inNy-0sUs9P6u-a6y4GlqLUtSNPDafFD6P1mqxP19S22rYxXYgX_OYADvzZk42BlfgPcrLsyBh0Pn3TCmlj5IQuOuLqbIbDKLg-AU9ohvBh1NyIswSNLyxr1hintxc0Su7ERXI0CcyhR9dLrcLS7A6PFXCHPVaQhavCRo6GK6jsPlTHQUnGQmkmB1kjjcc5yJFpO9kaMnYj_pWWWoYd7I-t_S_dxt3C)

Also, guess what comes with all those imports? **Constructor with too many parameters** (and, in fact, in this class, I have 11 dependencies injected in the constructor) and **code that is too long** and difficult to understand (and, in fact, this class has 500+ lines).

A solution? Refactor your project in order to minimize scattering those dependencies.

## Wrapping up

Having all those imports (in C# we use the keyword `using`) is a good indicator that your code does too many things. You should focus on minimizing those imports **without cheating** (like using global imports).

Happy coding!

🐧
