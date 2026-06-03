$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$imagesPath = Join-Path $projectRoot "assets/images"
$galleryPath = Join-Path $projectRoot "js/gallery-images.js"
$extensions = @(".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")

$images = Get-ChildItem -LiteralPath $imagesPath -File |
  Where-Object { $extensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object Name |
  ForEach-Object { $_.Name }

$lines = @("window.galleryImages = [")

for ($index = 0; $index -lt $images.Count; $index += 1) {
  $escapedName = $images[$index].Replace("\", "\\").Replace('"', '\"')
  $suffix = if ($index -eq $images.Count - 1) { "" } else { "," }
  $lines += "  ""$escapedName""$suffix"
}

$lines += "];"

Set-Content -LiteralPath $galleryPath -Value $lines -Encoding UTF8
