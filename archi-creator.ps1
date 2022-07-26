git checkout master
git pull

$tmpSlug =  Read-Host -Prompt 'Architecture tip slug?'
$newFolderName = $tmpSlug

$rootLocation = Get-Location
$placeholderImgLocation = "\assets\img_placeholder.png"

Set-Location ".\content\posts\architecture-tips"

git checkout -b archi-tip/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Get-Location

Set-Location $newFolderName
$currentLocation = Get-Location

Add-Content article.md "---"
Add-Content article.md "title: `"Architeture Notes: $tmpSlug`""
Add-Content article.md "path: `'/architecture-notes/$tmpSlug`'"
Add-Content article.md "tags: [`"Software Architecture`", `"Architecture`"]"
Add-Content article.md "featuredImage: `"./cover.png`""
Add-Content article.md "excerpt: `"a description for $tmpSlug`""
Add-Content article.md "created: 4219-11-20"
Add-Content article.md "updated: 4219-11-20"
Add-Content article.md "---" 

Copy-Item $rootLocation$placeholderImgLocation -Destination "$currentLocation\cover.png"
