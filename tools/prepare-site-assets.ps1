param(
  [Parameter(Mandatory = $true)][string]$ProjectRoot
)

Add-Type -AssemblyName System.Drawing

$assets = Join-Path $ProjectRoot 'dist\assets'
New-Item -ItemType Directory -Force -Path $assets | Out-Null

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$photos = @(
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.26 (1).jpeg'; Name = 'hero-conselho.jpg'; Width = 1800 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.39.56 (2).jpeg'; Name = 'tela-conselho.jpg'; Width = 1400 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.39.56 (1).jpeg'; Name = 'tela-brinde.jpg'; Width = 1200 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.39.56.jpeg'; Name = 'tela-trio-2.jpg'; Width = 1200 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.15.jpeg'; Name = 'tela-trio-3.jpg'; Width = 1200 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.39.57.jpeg'; Name = 'encontro-noite.jpg'; Width = 1400 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.07 (1).jpeg'; Name = 'mascotes-mesa.jpg'; Width = 1100 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.14.jpeg'; Name = 'grupo-vermelho.jpg'; Width = 1600 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.15 (1).jpeg'; Name = 'ritual-palco.jpg'; Width = 1600 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.16 (1).jpeg'; Name = 'abraco.jpg'; Width = 1600 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.16 (2).jpeg'; Name = 'conselho-sala.jpg'; Width = 1500 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.16.jpeg'; Name = 'bandeiras.jpg'; Width = 1700 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.23.jpeg'; Name = 'rede-junta.jpg'; Width = 1200 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.25 (1).jpeg'; Name = 'selfie.jpg'; Width = 1500 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.25 (2).jpeg'; Name = 'historias.jpg'; Width = 1100 },
  @{ Source = 'imagens\WhatsApp Image 2026-11-13 at 10.40.25.jpeg'; Name = 'mascotes-utfpr.jpg'; Width = 1500 }
)

function Save-OptimizedJpeg([string]$sourcePath, [string]$destinationPath, [int]$maxWidth) {
  $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $targetWidth = [Math]::Min($maxWidth, $sourceImage.Width)
    $targetHeight = [int][Math]::Round($sourceImage.Height * ($targetWidth / $sourceImage.Width))
    $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)
      } finally { $graphics.Dispose() }

      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $encoder = [System.Drawing.Imaging.Encoder]::Quality
      $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]82)
      $bitmap.Save($destinationPath, $codec, $parameters)
      $parameters.Dispose()
    } finally { $bitmap.Dispose() }
  } finally { $sourceImage.Dispose() }
}

foreach ($photo in $photos) {
  Save-OptimizedJpeg (Join-Path $root $photo.Source) (Join-Path $assets $photo.Name) $photo.Width
}

Copy-Item -LiteralPath (Join-Path $root 'contexto\logo-nejlon-bj-fejepar.png') -Destination (Join-Path $assets 'logo-nejlon.png') -Force
Copy-Item -LiteralPath (Join-Path $root 'contexto\todas-ej-juntos.png') -Destination (Join-Path $assets 'todas-ej-juntas.png') -Force
