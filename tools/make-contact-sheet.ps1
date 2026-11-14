param(
  [Parameter(Mandatory = $true)][string]$InputDirectory,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [int]$Columns = 4,
  [int]$ThumbWidth = 300,
  [int]$ThumbHeight = 220
)

Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -LiteralPath $InputDirectory -File | Where-Object { $_.Extension -match '^\.(png|jpe?g)$' }
$labelHeight = 44
$cellWidth = $ThumbWidth + 20
$cellHeight = $ThumbHeight + $labelHeight + 20
$rows = [Math]::Ceiling($files.Count / $Columns)
$sheet = New-Object System.Drawing.Bitmap ($Columns * $cellWidth), ($rows * $cellHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::FromArgb(245, 242, 234))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font('Arial', 9)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 35, 35))

for ($i = 0; $i -lt $files.Count; $i++) {
  $row = [Math]::Floor($i / $Columns)
  $col = $i % $Columns
  $x = $col * $cellWidth + 10
  $y = $row * $cellHeight + 10
  $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
  $scale = [Math]::Min($ThumbWidth / $img.Width, $ThumbHeight / $img.Height)
  $w = [int]($img.Width * $scale)
  $h = [int]($img.Height * $scale)
  $ix = $x + [int](($ThumbWidth - $w) / 2)
  $iy = $y + [int](($ThumbHeight - $h) / 2)
  $graphics.DrawImage($img, $ix, $iy, $w, $h)
  $label = ('{0:D2}  {1}' -f ($i + 1), $files[$i].Name)
  $graphics.DrawString($label, $font, $brush, $x, ($y + $ThumbHeight + 5))
  $img.Dispose()
}

$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDir)) { New-Item -ItemType Directory -Path $outputDir | Out-Null }
$sheet.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $sheet.Dispose()
