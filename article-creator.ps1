$tmpSlug =  Read-Host -Prompt 'Article slug?'
$currentYear = Get-Date -Format "yyyy"
$newFolderName = $currentYear +"/" + $tmpSlug

Set-Location ".\content\posts"

git checkout master
git pull
git checkout -b article/$tmpSlug


New-Item -Path "." -Name $newFolderName -ItemType "directory"

Set-Location $newFolderName

Add-Content article.md "---"
Add-Content article.md "title: `"Placeholder title`""
Add-Content article.md "path: `'/blog/$tmpSlug`'"
Add-Content article.md "tags: []"
Add-Content article.md "featuredImage: `"`""
Add-Content article.md "excerpt : `"a description for $tmpSlug`""
Add-Content article.md "created: `"4219-11-20`""
Add-Content article.md "updated: `"4219-11-20`""
Add-Content article.md "---"
Add-Content article.md "Put your article HERE"
