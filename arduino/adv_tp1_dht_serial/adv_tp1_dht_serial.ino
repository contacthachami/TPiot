#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidite = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidite) || isnan(temperature)) {
    Serial.println("Erreur de lecture du capteur DHT");
    delay(2000);
    return;
  }

  Serial.print("Humidite: ");
  Serial.print(humidite, 1);
  Serial.print(" % | Temperature: ");
  Serial.print(temperature, 1);
  Serial.println(" C");

  delay(2000);
}
