git checkout master
git pull

$tmpSlug =  Read-Host -Prompt 'Article slug?'
$currentYear = Get-Date -Format "yyyy"
$newFolderName = $currentYear +"/" + $tmpSlug

$rootLocation = Get-Location
$placeholderImgLocation = "\assets\img_placeholder.png"

Set-Location ".\content\posts"



git checkout -b article/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Get-Location

Set-Location $newFolderName
$currentLocation = Get-Location

Add-Content article.md "---"
Add-Content article.md "title: `"Placeholder title`""
Add-Content article.md "path: `"/blog/$tmpSlug`""
Add-Content article.md "tags: [`"MainArticle`"]"
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
Add-Content article.md "Happy coding!"
Add-Content article.md "" 
Add-Content article.md "🐧"

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
