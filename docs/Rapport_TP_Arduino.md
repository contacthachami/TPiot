# Rapport - Travaux Pratiques Arduino IoT

Module : IoT  
Filiere : Bachelor 3IASD  
Annee universitaire : 2025/2026  
Professeur : Pr. Said Benkirane

## Objectif general

Ce travail realise tous les exercices du document `TP_Arduino.pdf`. Les TPs couvrent les sorties numeriques, la temporisation, les sequences de LED, le controle d'un servomoteur, la mesure de distance avec HC-SR04, la lecture d'un capteur DHT et l'envoi ou l'affichage de donnees via Wi-Fi.

## Simulateurs utilises

Le livrable contient :

- des projets Wokwi dans `wokwi/`, pratiques pour simuler Arduino Uno, ESP32, servo, HC-SR04 et DHT22 ;
- un simulateur local dans `simulateur-local/`, utilisable hors-ligne dans un navigateur et donc independant d'un abonnement.

## Exercices de base

### TP1 - Allumer une LED

Materiel :

- Arduino Uno
- 1 LED
- 1 resistance 220 ohms
- Fils de connexion

Cablage :

- Anode de la LED vers D13 via la resistance 220 ohms
- Cathode de la LED vers GND

Code : `arduino/base_tp1_led_on/base_tp1_led_on.ino`

Resultat attendu : la LED reste allumee en continu apres le demarrage de la carte.

### TP2 - LED clignotante

Materiel :

- Arduino Uno
- 1 LED
- 1 resistance 220 ohms
- Fils de connexion

Cablage :

- Anode de la LED vers D13 via la resistance 220 ohms
- Cathode de la LED vers GND

Code : `arduino/base_tp2_led_blink/base_tp2_led_blink.ino`

Resultat attendu : la LED s'allume pendant 1 seconde puis s'eteint pendant 1 seconde, en boucle.

### TP3 - Chenillard

Materiel :

- Arduino Uno
- 4 LED
- 4 resistances 220 ohms
- Fils de connexion

Cablage :

- LED 1 vers D2 via resistance
- LED 2 vers D3 via resistance
- LED 3 vers D4 via resistance
- LED 4 vers D5 via resistance
- Cathodes vers GND

Code : `arduino/base_tp3_chenillard/base_tp3_chenillard.ino`

Resultat attendu : les LED s'allument l'une apres l'autre avec un delai de 300 ms.

## Exercices intermediaires

### TP1 - Controle d'un servomoteur

Materiel :

- Arduino Uno
- Servomoteur SG90
- Fils de connexion

Cablage :

- Fil rouge du servo vers 5V
- Fil marron/noir vers GND
- Fil orange/jaune vers D9

Code : `arduino/inter_tp1_servo_sweep/inter_tp1_servo_sweep.ino`

Resultat attendu : le servo prend successivement les positions 0 deg, 90 deg et 180 deg.

### Variante - Servo avec potentiometre

Materiel :

- Arduino Uno
- Servomoteur SG90
- Potentiometre
- Fils de connexion

Cablage :

- Signal servo vers D9
- Signal potentiometre vers A0
- VCC vers 5V
- GND commun

Code : `arduino/inter_tp1b_servo_pot/inter_tp1b_servo_pot.ino`

Resultat attendu : l'angle du servo varie de 0 deg a 180 deg selon la position du potentiometre.

### TP2 - Capteur ultrason HC-SR04

Materiel :

- Arduino Uno
- Capteur HC-SR04
- Fils de connexion

Cablage :

- VCC vers 5V
- GND vers GND
- Trig vers D9
- Echo vers D10

Code : `arduino/inter_tp2_hcsr04_distance/inter_tp2_hcsr04_distance.ino`

Resultat attendu : la distance est calculee en centimetres et affichee sur le moniteur serie.

### TP3 - HC-SR04 avec LED d'alerte

Materiel :

- Arduino Uno
- Capteur HC-SR04
- 1 LED
- 1 resistance 220 ohms
- Fils de connexion

Cablage :

- HC-SR04 : VCC 5V, GND, Trig D9, Echo D10
- LED : anode vers D3 via resistance, cathode vers GND

Code : `arduino/inter_tp3_hcsr04_led/inter_tp3_hcsr04_led.ino`

Resultat attendu : la LED s'allume si la distance mesuree est inferieure a 10 cm.

## Exercices avances

### TP1 - DHT11/DHT22 temperature et humidite

Materiel :

- Arduino Uno
- Capteur DHT11 ou DHT22
- Resistance 10 kohms
- Breadboard
- Fils de connexion

Cablage :

- VCC vers 5V
- GND vers GND
- DATA vers D2
- Resistance 10 kohms entre DATA et VCC

Code : `arduino/adv_tp1_dht_serial/adv_tp1_dht_serial.ino`

Resultat attendu : l'humidite et la temperature sont affichees toutes les 2 secondes dans le moniteur serie.

Note : la simulation Wokwi utilise DHT22, car ce composant est directement disponible dans le simulateur. Pour un DHT11 reel, modifier `DHTTYPE DHT22` en `DHTTYPE DHT11`.

### TP2 - ESP32 Wi-Fi avec DHT

Materiel :

- Carte ESP32
- Capteur DHT11 ou DHT22
- Breadboard
- Fils de connexion

Cablage :

- DHT VCC vers 3V3
- DHT GND vers GND
- DHT DATA vers GPIO15

Code : `arduino/adv_tp2_esp32_dht_wifi/adv_tp2_esp32_dht_wifi.ino`

Fonctionnement :

- l'ESP32 se connecte au Wi-Fi ;
- il lit temperature et humidite ;
- il expose une page web locale sur `/` ;
- il expose les donnees au format JSON sur `/data` ;
- si une cle ThingSpeak est renseignee, il envoie aussi les mesures vers ThingSpeak.

Resultat attendu : la station meteo affiche les valeurs DHT en serie et via une page web locale.

## Conclusion

Les TPs montrent la progression classique d'un projet IoT : commander une sortie, lire un capteur, prendre une decision locale, puis publier les mesures via Wi-Fi. Les fichiers fournis permettent de tester les exercices en simulation et de les adapter ensuite sur du materiel reel.
