git checkout master
git pull

$tmpSlug =  Read-Host -Prompt 'Cc tip slug?'
$newFolderName = $tmpSlug

$rootLocation = Get-Location
$placeholderImgLocation = "\assets\img_placeholder.png"

Set-Location ".\content\posts\cleancode-tips"

git checkout -b cctip/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Get-Location

Set-Location $newFolderName
$currentLocation = Get-Location

Add-Content article.md "---"
Add-Content article.md "title: `"Clean Code Tip: $tmpSlug`""
Add-Content article.md "path: `"/cleancodetips/$tmpSlug`""
Add-Content article.md "tags: [`"Clean Code`", `"Clean Code Tip`"]"
Add-Content article.md "featuredImage: `"./cover.png`""
Add-Content article.md "excerpt: `"a description for $tmpSlug`""
Add-Content article.md "created: 4219-11-20"
Add-Content article.md "updated: 4219-11-20"
Add-Content article.md "---" 
Add-Content article.md "" 
Add-Content article.md "<content>"
Add-Content article.md "" 
Add-Content article.md "## Further readings"
Add-Content article.md "" 
Add-Content article.md "<links>"
Add-Content article.md "" 
Add-Content article.md "*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*"

Add-Content article.md "" 
Add-Content article.md "## Wrapping up"
Add-Content article.md "" 
Add-Content article.md "<Conclusion>"
Add-Content article.md "" 
Add-Content article.md "I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛 " 
Add-Content article.md "" 

Add-Content article.md "Happy coding!"
Add-Content article.md "" 
Add-Content article.md "🐧"
Add-Content article.md "" 

Add-Content article.md "## APPUNTI"
Add-Content article.md "" 
Add-Content article.md "[ ] Check grammar"
Add-Content article.md "" 
Add-Content article.md "[ ] Check titles"
Add-Content article.md "" 
Add-Content article.md "[ ] Alt text"
Add-Content article.md "" 
Add-Content article.md "[ ] Check bold/italics"
Add-Content article.md "" 
Add-Content article.md "[ ] Check frontmatter"

Copy-Item $rootLocation$placeholderImgLocation -Destination "$currentLocation\cover.png"
