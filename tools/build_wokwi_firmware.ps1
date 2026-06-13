param(
  [string]$Tp = "all"
)

$ErrorActionPreference = "Stop"

$cli = Join-Path $env:LOCALAPPDATA "Programs\Arduino IDE\resources\app\lib\backend\resources\arduino-cli.exe"
if (-not (Test-Path $cli)) {
  throw "arduino-cli.exe introuvable. Installe Arduino IDE ou ajoute arduino-cli au PATH."
}

$localLibs = Join-Path $env:LOCALAPPDATA "Arduino15\libraries"
$userLibs = Join-Path $env:USERPROFILE "Documents\Arduino\libraries"

$unoProjects = @(
  "base_tp1_led_on",
  "base_tp2_led_blink",
  "base_tp3_chenillard",
  "inter_tp1_servo_sweep",
  "inter_tp1b_servo_pot",
  "inter_tp2_hcsr04_distance",
  "inter_tp3_hcsr04_led",
  "adv_tp1_dht_serial"
)

function Build-UnoProject {
  param([string]$Name)

  Write-Host "=== Compilation Arduino Uno: $Name ==="
  & $cli compile `
    --fqbn arduino:avr:uno `
    --libraries $localLibs `
    --libraries $userLibs `
    --output-dir "wokwi\$Name\build" `
    "arduino\$Name"
}

function Build-Esp32Project {
  $name = "adv_tp2_esp32_dht_wifi"
  $cores = & $cli core list
  if ($cores -notmatch "esp32:esp32") {
    Write-Host "Core ESP32 absent. Installe-le avec:"
    Write-Host "& `"$cli`" core install esp32:esp32"
    return
  }

  Write-Host "=== Compilation ESP32: $name ==="
  & $cli compile `
    --fqbn esp32:esp32:esp32 `
    --libraries $localLibs `
    --libraries $userLibs `
    --output-dir "wokwi\$name\build" `
    "arduino\$name"
}

if ($Tp -eq "all") {
  foreach ($name in $unoProjects) {
    Build-UnoProject $name
  }
  Build-Esp32Project
} elseif ($Tp -eq "adv_tp2_esp32_dht_wifi") {
  Build-Esp32Project
} elseif ($unoProjects -contains $Tp) {
  Build-UnoProject $Tp
} else {
  throw "TP inconnu: $Tp"
}
