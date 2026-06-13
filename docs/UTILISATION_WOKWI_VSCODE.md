# Utiliser Wokwi dans VS Code

## Pourquoi l'erreur apparait ?

L'erreur `Wokwi: wokwi.toml configuration file not found in workspace` veut dire que Wokwi VS Code cherche un fichier `wokwi.toml` dans le dossier racine ouvert par VS Code.

Dans ce projet, il y a plusieurs TPs. Il ne faut donc pas lancer Wokwi depuis le grand dossier `IOT` comme un seul projet. Chaque dossier `wokwi/<nom-du-tp>` est un projet Wokwi separe.

## Methode recommandee

1. Ferme le workspace actuel ou garde-le de cote.
2. Ouvre le fichier :

   `TP-Arduino-Wokwi.code-workspace`

3. Dans l'explorateur VS Code, ouvre le dossier du TP voulu.
4. Clique sur `diagram.json`.
5. Clique sur le bouton Play vert de Wokwi.

## Methode alternative

Ouvre directement un seul dossier de TP :

`File > Open Folder...`

Puis choisis par exemple :

`C:\Users\HP\Desktop\Bachelor\S6\IOT\wokwi\inter_tp2_hcsr04_distance`

Ensuite :

1. ouvre `diagram.json` ;
2. clique sur Play ;
3. regarde le moniteur serie si le TP utilise `Serial.print`.

## Firmware deja prepare

Les firmwares `.hex` ont ete generes pour les TPs Arduino Uno :

- `base_tp1_led_on`
- `base_tp2_led_blink`
- `base_tp3_chenillard`
- `inter_tp1_servo_sweep`
- `inter_tp1b_servo_pot`
- `inter_tp2_hcsr04_distance`
- `inter_tp3_hcsr04_led`
- `adv_tp1_dht_serial`

Le TP `adv_tp2_esp32_dht_wifi` demande le core ESP32. Si Wokwi indique que le firmware `.bin` manque, compile-le apres avoir installe le core ESP32.

Le firmware ESP32 a aussi ete genere dans :

`wokwi/adv_tp2_esp32_dht_wifi/build/adv_tp2_esp32_dht_wifi.ino.bin`

## Recompiler les firmwares

Depuis le dossier racine `IOT`, lance :

```powershell
.\tools\build_wokwi_firmware.ps1
```

Pour compiler un seul TP :

```powershell
.\tools\build_wokwi_firmware.ps1 -Tp inter_tp2_hcsr04_distance
```

Pour installer le core ESP32 si necessaire :

```powershell
& "$env:LOCALAPPDATA\Programs\Arduino IDE\resources\app\lib\backend\resources\arduino-cli.exe" core install esp32:esp32
```

## Option gratuite/offline

Si tu veux juste voir le resultat sans configuration Wokwi :

`simulateur-local/index.html`

Ce simulateur local fonctionne directement dans le navigateur et couvre tous les TPs.
