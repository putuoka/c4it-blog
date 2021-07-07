$tmpSlug =  Read-Host -Prompt 'Article slug?'
$currentYear = Get-Date -Format "yyyy"
$newFolderName = $currentYear +"/" + $tmpSlug

Set-Location ".\content\posts"

$rootLocation = Get-Location
$placeholderImgLocation = "\assets\img_placeholder.png"

git checkout master
git pull
git checkout -b article/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Set-Location $newFolderName
$currentLocation = Get-Location

Add-Content article.md "---"
Add-Content article.md "title: `"Placeholder title`""
Add-Content article.md "path: `'/blog/$tmpSlug`'"
Add-Content article.md "tags: []"
Add-Content article.md "featuredImage: `"`""
Add-Content article.md "excerpt : `"a description for $tmpSlug`""
Add-Content article.md "created: 4219-11-20"
Add-Content article.md "updated: 4219-11-20"
Add-Content article.md "---" 

Copy-Item $rootLocation$placeholderImgLocation -Destination "$currentLocation\cover.png"
