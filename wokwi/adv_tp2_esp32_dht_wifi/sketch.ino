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
  String html = "<!doctype html><html lang='fr'><head><meta charset='utf-8'>";
  html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<meta http-equiv='refresh' content='5'>";
  html += "<title>Station meteo ESP32</title>";
  html += "<link href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' rel='stylesheet'>";
  html += "<style>";
  html += "body{margin:0;padding:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e0e7ef 0%,#f3f6fa 100%);font-family:'Roboto',Arial,sans-serif;}";
  html += ".container{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100vw;height:100vh;}";
  html += ".card{background:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.12);border-radius:20px;padding:40px 36px;max-width:420px;width:95vw;display:flex;flex-direction:column;align-items:center;border:1px solid #e0e7ef;}";
  html += ".title{font-size:2.3rem;font-weight:700;margin-bottom:28px;color:#1a2236;letter-spacing:-1px;}";
  html += ".row{display:flex;align-items:center;gap:18px;margin-bottom:24px;width:100%;} ";
  html += ".icon{font-size:2.6rem;}";
  html += ".label{font-size:1.15rem;color:#6b7280;margin-bottom:2px;}";
  html += ".value{font-size:2.5rem;font-weight:700;color:#059669;line-height:1.1;letter-spacing:-1px;}";
  html += ".ip{margin-top:18px;font-size:1.05rem;color:#64748b;text-align:center;}";
  html += "@media(max-width:600px){.card{padding:18px 2vw;max-width:99vw;}.title{font-size:1.5rem;}}";
  html += "</style></head><body><div class='container'><div class='card'>";
  html += "<div class='title'>Station météo ESP32</div>";

  if (sensorOk) {
    html += "<div class='row'><span class='icon'>🌡️</span><div><div class='label'>Température</div><div class='value'>";
    html += String(temperature, 1);
    html += "&nbsp;°C</div></div></div>";
    html += "<div class='row'><span class='icon'>💧</span><div><div class='label'>Humidité</div><div class='value'>";
    html += String(humidite, 1);
    html += "&nbsp;%</div></div></div>";
  } else {
    html += "<div class='row'><span class='icon'>⚠️</span><div><div class='label'>Erreur</div><div class='value' style='color:#dc2626'>Capteur DHT non disponible</div></div></div>";
  }

  html += "<div class='ip'>IP : ";
  html += WiFi.localIP().toString();
  html += "</div></div></div></body></html>";

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
