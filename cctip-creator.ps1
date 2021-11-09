$tmpSlug =  Read-Host -Prompt 'Cc tip slug?'
$newFolderName = $tmpSlug

$rootLocation = Get-Location
$placeholderImgLocation = "\assets\img_placeholder.png"

Set-Location ".\content\posts\cleancode-tips"


git checkout master
git pull
git checkout -b cctip/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Get-Location

Set-Location $newFolderName
$currentLocation = Get-Location

Add-Content article.md "---"
Add-Content article.md "title: `"Clean Code Tip: $tmpSlug`""
Add-Content article.md "path: `'/cleancodetips/$tmpSlug`'"
Add-Content article.md "tags: [`"Clean Code`", `"Clean Code Tip`"]"
Add-Content article.md "featuredImage: `"./cover.png`""
Add-Content article.md "excerpt: `"a description for $tmpSlug`""
Add-Content article.md "created: 4219-11-20"
Add-Content article.md "updated: 4219-11-20"
Add-Content article.md "---" 

Copy-Item $rootLocation$placeholderImgLocation -Destination "$currentLocation\cover.png"
