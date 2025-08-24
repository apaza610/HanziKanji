# Prompt for folder path
$folderPath = Read-Host "Enter the full path to the folder containing SVG files"

# Validate folder
if (-not (Test-Path $folderPath)) {
    Write-Host "❌ Folder not found. Please check the path." -ForegroundColor Red
    exit
}

# Get all SVG files
$svgFiles = Get-ChildItem -Path $folderPath -Filter *.svg

if ($svgFiles.Count -eq 0) {
    Write-Host "⚠️ No SVG files found in the folder." -ForegroundColor Yellow
    exit
}

# Loop through each SVG and run comandito.py
foreach ($file in $svgFiles) {
    $svgPath = $file.FullName
    Write-Host "▶️ Processing: $svgPath"

    # Run the Python script with the SVG path as argument
    python extract_embedded_images_from_svg.py "$svgPath"
}