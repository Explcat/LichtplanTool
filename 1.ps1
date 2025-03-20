# -----------------------------------
# PowerShell Script: Export TS/TSX Files Overview
# -----------------------------------

# Define the project root (current directory by default)
$projectRoot = (Get-Location).Path

# Define the output file path
$outputFile = Join-Path $projectRoot 'ProjectOverview.txt'

# Get all *.ts and *.tsx files in current directory and subdirectories
$files = Get-ChildItem -Path $projectRoot -Recurse -Include *.js,*.html |
    Where-Object { -not $_.PSIsContainer }

# Initialize an array to hold the output content
$outputContent = @()

# Project overview header
$outputContent += 'Project Structure and Code Overview'
$outputContent += '==================================='
$outputContent += ''
$outputContent += "Project Root: $projectRoot"
$outputContent += ''

# Function to get relative path from project root
function Get-RelativePath {
    param (
        [string]$FullPath,
        [string]$RootPath
    )
    
    # Remove the root path from the file's full path
    return $FullPath.Substring($RootPath.Length + 1)
}

# Process each file
foreach ($file in $files) {

    # Compute relative path
    $relativePath = Get-RelativePath -FullPath $file.FullName -RootPath $projectRoot
    
    # Read the file’s content
    $codeContent = Get-Content -Path $file.FullName -Raw
    
    # Add file information and code to the output
    $outputContent += "File: $relativePath"
    $outputContent += '-------------------------'
    $outputContent += '```typescript'
    $outputContent += $codeContent
    $outputContent += '```'
    $outputContent += ''
}

# Write the output content to the output file (UTF8)
$outputContent | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Project overview has been written to $outputFile"
