#include <HTTPClient.h>
#include <WebServer.h>
#include <WiFi.h>
#include "DHTesp.h"

const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASSWORD = "";
const char *THINGSPEAK_API_KEY = "";

const byte DHT_PIN = 15;
const unsigned long READ_INTERVAL_MS = 2000;
const unsigned long SEND_INTERVAL_MS = 20000;

DHTesp dhtSensor;
WebServer server(80);

float temperature = 0.0;
float humidite = 0.0;
bool sensorOk = false;
unsigned long lastReadMs = 0;
unsigned long lastSendMs = 0;

void lireDht() {
  TempAndHumidity data = dhtSensor.getTempAndHumidity();

  sensorOk = !isnan(data.temperature) && !isnan(data.humidity);
  if (!sensorOk) {
    Serial.println("Erreur de lecture du capteur DHT");
    return;
  }

  temperature = data.temperature;
  humidite = data.humidity;

  Serial.print("Temperature: ");
  Serial.print(temperature, 1);
  Serial.print(" C | Humidite: ");
  Serial.print(humidite, 1);
  Serial.println(" %");
}

void envoyerThingSpeak() {
  if (THINGSPEAK_API_KEY[0] == '\0' || !sensorOk || WiFi.status() != WL_CONNECTED) {
    return;
  }

  HTTPClient http;
  String url = "http://api.thingspeak.com/update?api_key=";
  url += THINGSPEAK_API_KEY;
  url += "&field1=";
  url += String(temperature, 1);
  url += "&field2=";
  url += String(humidite, 1);

  http.begin(url);
  int codeHttp = http.GET();
  Serial.print("ThingSpeak HTTP: ");
  Serial.println(codeHttp);
  http.end();
}

void pageAccueil() {
  String html = "<!doctype html><html><head><meta charset='utf-8'>";
  html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<meta http-equiv='refresh' content='5'>";
  html += "<title>Station meteo ESP32</title>";
  html += "<style>body{font-family:Arial;margin:30px;background:#f7fafc;color:#172033}";
  html += ".box{max-width:520px;padding:22px;border:1px solid #d7dee8;background:white;border-radius:8px}";
  html += "strong{font-size:34px;color:#0f766e}</style></head><body><div class='box'>";
  html += "<h1>Station meteo ESP32</h1>";

  if (sensorOk) {
    html += "<p>Temperature<br><strong>";
    html += String(temperature, 1);
    html += " C</strong></p><p>Humidite<br><strong>";
    html += String(humidite, 1);
    html += " %</strong></p>";
  } else {
    html += "<p>Capteur DHT non disponible.</p>";
  }

  html += "<p>IP: ";
  html += WiFi.localIP().toString();
  html += "</p></div></body></html>";

  server.send(200, "text/html", html);
}

void donneesJson() {
  String json = "{";
  json += "\"temperature\":";
  json += String(temperature, 1);
  json += ",\"humidite\":";
  json += String(humidite, 1);
  json += ",\"ok\":";
  json += sensorOk ? "true" : "false";
  json += "}";

  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connexion Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connecte. IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", pageAccueil);
  server.on("/data", donneesJson);
  server.begin();
}

void loop() {
  server.handleClient();

  unsigned long maintenant = millis();
  if (maintenant - lastReadMs >= READ_INTERVAL_MS) {
    lastReadMs = maintenant;
    lireDht();
  }

  if (maintenant - lastSendMs >= SEND_INTERVAL_MS) {
    lastSendMs = maintenant;
    envoyerThingSpeak();
  }
}
