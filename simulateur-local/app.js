const tpData = [
  {
    id: "base-led-on",
    category: "Exercices de base",
    title: "TP1 - Allumer une LED",
    mode: "ledOn",
    board: "Arduino Uno",
    pins: ["D13", "GND", "5V"],
    materials: ["Arduino Uno", "1 LED", "1 resistance 220 ohms", "Fils de connexion"],
    wiring: ["Anode LED vers D13 via resistance 220 ohms", "Cathode LED vers GND"],
    code: `const byte LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
}

void loop() {
}`
  },
  {
    id: "base-blink",
    category: "Exercices de base",
    title: "TP2 - LED clignotante",
    mode: "blink",
    board: "Arduino Uno",
    pins: ["D13", "GND"],
    materials: ["Arduino Uno", "1 LED", "1 resistance 220 ohms", "Fils de connexion"],
    wiring: ["Anode LED vers D13 via resistance 220 ohms", "Cathode LED vers GND"],
    code: `void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`
  },
  {
    id: "base-chaser",
    category: "Exercices de base",
    title: "TP3 - Chenillard de LED",
    mode: "chaser",
    board: "Arduino Uno",
    pins: ["D2", "D3", "D4", "D5", "GND"],
    materials: ["Arduino Uno", "4 LED", "4 resistances 220 ohms", "Fils de connexion"],
    wiring: ["LED 1 vers D2", "LED 2 vers D3", "LED 3 vers D4", "LED 4 vers D5", "Cathodes vers GND"],
    code: `const byte LED_PINS[] = {2, 3, 4, 5};

void loop() {
  for (byte i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(300);
    digitalWrite(LED_PINS[i], LOW);
  }
}`
  },
  {
    id: "servo-sweep",
    category: "Exercices intermediaires",
    title: "TP1 - Servomoteur",
    mode: "servoSweep",
    board: "Arduino Uno",
    pins: ["D9", "5V", "GND"],
    materials: ["Arduino Uno", "Servomoteur SG90", "Fils de connexion"],
    wiring: ["Rouge servo vers 5V", "Marron ou noir vers GND", "Orange ou jaune vers D9"],
    code: `#include <Servo.h>

Servo monServo;

void loop() {
  monServo.write(0);
  delay(1000);
  monServo.write(90);
  delay(1000);
  monServo.write(180);
  delay(1000);
}`
  },
  {
    id: "servo-pot",
    category: "Exercices intermediaires",
    title: "Variante - Servo avec potentiometre",
    mode: "servoPot",
    board: "Arduino Uno",
    pins: ["D9", "A0", "5V", "GND"],
    materials: ["Arduino Uno", "Servomoteur SG90", "Potentiometre", "Fils de connexion"],
    wiring: ["Signal servo vers D9", "Signal potentiometre vers A0", "VCC vers 5V", "GND commun"],
    code: `int valeurPot = analogRead(A0);
int angle = map(valeurPot, 0, 1023, 0, 180);

monServo.write(angle);
delay(15);`
  },
  {
    id: "ultrasonic-distance",
    category: "Exercices intermediaires",
    title: "TP2 - HC-SR04 distance",
    mode: "ultrasonic",
    board: "Arduino Uno",
    pins: ["D9", "D10", "5V", "GND"],
    materials: ["Arduino Uno", "Capteur ultrason HC-SR04", "Fils de connexion"],
    wiring: ["VCC vers 5V", "GND vers GND", "Trig vers D9", "Echo vers D10"],
    code: `digitalWrite(TRIG_PIN, HIGH);
delayMicroseconds(10);
digitalWrite(TRIG_PIN, LOW);

unsigned long duree = pulseIn(ECHO_PIN, HIGH);
float distance = duree * 0.0343 / 2.0;`
  },
  {
    id: "ultrasonic-led",
    category: "Exercices intermediaires",
    title: "TP3 - HC-SR04 avec LED alerte",
    mode: "ultrasonicLed",
    board: "Arduino Uno",
    pins: ["D3", "D9", "D10", "5V", "GND"],
    materials: ["Arduino Uno", "Capteur HC-SR04", "1 LED", "1 resistance 220 ohms"],
    wiring: ["HC-SR04: Trig D9, Echo D10", "LED: anode vers D3 via resistance", "LED: cathode vers GND"],
    code: `float distance = mesurerDistanceCm();
bool proche = distance > 0 && distance < 10.0;

digitalWrite(LED_PIN, proche ? HIGH : LOW);`
  },
  {
    id: "dht-serial",
    category: "Exercices avances",
    title: "TP1 - DHT temperature et humidite",
    mode: "dht",
    board: "Arduino Uno",
    pins: ["D2", "5V", "GND"],
    materials: ["Arduino Uno", "Capteur DHT22 ou DHT11", "Resistance 10 kohms", "Breadboard", "Fils"],
    wiring: ["VCC vers 5V", "GND vers GND", "DATA vers D2", "Resistance 10 kohms entre DATA et VCC"],
    code: `float h = dht.readHumidity();
float t = dht.readTemperature();

Serial.print("Humidite: ");
Serial.print(h);
Serial.print(" % | Temperature: ");
Serial.println(t);`
  },
  {
    id: "wifi-dht",
    category: "Exercices avances",
    title: "TP2 - ESP32 Wi-Fi avec DHT",
    mode: "wifiDht",
    board: "ESP32 DevKit",
    pins: ["GPIO15", "3V3", "GND", "Wi-Fi"],
    materials: ["Carte ESP32", "Capteur DHT22 ou DHT11", "Breadboard", "Fils de connexion"],
    wiring: ["DHT VCC vers 3V3", "DHT GND vers GND", "DHT DATA vers GPIO15", "ESP32 connecte au Wi-Fi"],
    code: `WiFi.begin("Wokwi-GUEST", "");
server.on("/", pageAccueil);
server.on("/data", donneesJson);

// Option: renseigner THINGSPEAK_API_KEY
// pour publier aussi vers ThingSpeak.`
  }
];

const state = {
  activeId: tpData[0].id,
  distance: 8,
  potentiometer: 512,
  temperature: 24,
  humidity: 45,
  tickStart: Date.now()
};

const elements = {
  tpList: document.querySelector("#tpList"),
  tpCategory: document.querySelector("#tpCategory"),
  tpTitle: document.querySelector("#tpTitle"),
  board: document.querySelector("#board"),
  boardTitle: document.querySelector("#boardTitle"),
  pinList: document.querySelector("#pinList"),
  wireLayer: document.querySelector("#wireLayer"),
  ledStrip: document.querySelector("#ledStrip"),
  servoBlock: document.querySelector("#servoBlock"),
  servoArm: document.querySelector("#servoArm"),
  servoValue: document.querySelector("#servoValue"),
  sensorBlock: document.querySelector("#sensorBlock"),
  sensorLabel: document.querySelector("#sensorLabel"),
  sensorValue: document.querySelector("#sensorValue"),
  sensorMeter: document.querySelector("#sensorMeter"),
  dashboardBlock: document.querySelector("#dashboardBlock"),
  dashboardMain: document.querySelector("#dashboardMain"),
  dashboardSub: document.querySelector("#dashboardSub"),
  controls: document.querySelector("#controls"),
  serialBox: document.querySelector("#serialBox"),
  materialsList: document.querySelector("#materialsList"),
  wiringList: document.querySelector("#wiringList"),
  codePreview: document.querySelector("#codePreview"),
  resetButton: document.querySelector("#resetButton")
};

function getActiveTp() {
  return tpData.find((tp) => tp.id === state.activeId);
}

function renderTpList() {
  elements.tpList.innerHTML = tpData
    .map((tp) => `
      <button class="tp-button ${tp.id === state.activeId ? "is-active" : ""}" type="button" data-id="${tp.id}">
        <strong>${tp.title}</strong>
        <span>${tp.category}</span>
      </button>
    `)
    .join("");

  elements.tpList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeId = button.dataset.id;
      state.tickStart = Date.now();
      renderAll();
    });
  });
}

function renderList(target, items) {
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderStatic() {
  const tp = getActiveTp();
  elements.tpCategory.textContent = tp.category;
  elements.tpTitle.textContent = tp.title;
  elements.boardTitle.textContent = tp.board;
  elements.board.classList.toggle("is-esp32", tp.board.includes("ESP32"));
  elements.pinList.innerHTML = tp.pins.map((pin) => `<span class="pin-pill">${pin}</span>`).join("");
  renderList(elements.materialsList, tp.materials);
  renderList(elements.wiringList, tp.wiring);
  elements.codePreview.textContent = tp.code;
  renderControls(tp);
  renderTpList();
}

function renderControls(tp) {
  const controls = [];

  if (tp.mode === "servoPot") {
    controls.push(rangeControl("Potentiometre", "potentiometer", 0, 1023, state.potentiometer, ""));
  }

  if (tp.mode === "ultrasonic" || tp.mode === "ultrasonicLed") {
    controls.push(rangeControl("Distance obstacle", "distance", 2, 400, state.distance, " cm"));
  }

  if (tp.mode === "dht" || tp.mode === "wifiDht") {
    controls.push(rangeControl("Temperature", "temperature", -10, 60, state.temperature, " C"));
    controls.push(rangeControl("Humidite", "humidity", 0, 100, state.humidity, " %"));
  }

  if (controls.length === 0) {
    controls.push(`<p class="muted">Simulation automatique.</p>`);
  }

  elements.controls.innerHTML = controls.join("");
  elements.controls.querySelectorAll("input[type='range']").forEach((input) => {
    input.addEventListener("input", () => {
      state[input.name] = Number(input.value);
      const value = input.parentElement.querySelector("span");
      value.textContent = `${input.value}${input.dataset.unit}`;
      updateDynamic();
    });
  });
}

function rangeControl(label, name, min, max, value, unit) {
  return `
    <div class="control-row">
      <label for="${name}">${label}<span>${value}${unit}</span></label>
      <input id="${name}" name="${name}" type="range" min="${min}" max="${max}" value="${value}" data-unit="${unit}">
    </div>
  `;
}

function resetState() {
  state.distance = 8;
  state.potentiometer = 512;
  state.temperature = 24;
  state.humidity = 45;
  state.tickStart = Date.now();
  renderAll();
}

function setLedStrip(count, activeIndex, colors, labels = []) {
  elements.ledStrip.innerHTML = "";
  if (count === 0) {
    return;
  }

  for (let i = 0; i < count; i++) {
    const led = document.createElement("div");
    led.className = `led ${i === activeIndex || activeIndex === "all" ? "is-on" : ""}`;
    led.style.setProperty("--led-color", colors[i] || "#e5484d");
    led.innerHTML = `<div class="led-bulb"></div><small>${labels[i] || `LED ${i + 1}`}</small>`;
    elements.ledStrip.appendChild(led);
  }
}

function setWires(mode) {
  const lines = {
    ledOn: [["#16a34a", 246, 150, 120, -18], ["#111827", 246, 230, 118, 18]],
    blink: [["#16a34a", 246, 150, 120, -18], ["#111827", 246, 230, 118, 18]],
    chaser: [["#16a34a", 246, 125, 130, -25], ["#d97706", 246, 145, 150, -15], ["#2463eb", 246, 165, 170, -5], ["#7c3aed", 246, 185, 190, 4]],
    servoSweep: [["#d97706", 246, 150, 150, -18], ["#e5484d", 220, 250, 170, 14]],
    servoPot: [["#d97706", 246, 150, 150, -18], ["#16a34a", 246, 240, 140, 18]],
    ultrasonic: [["#16a34a", 246, 150, 160, -20], ["#2463eb", 246, 175, 170, 0]],
    ultrasonicLed: [["#16a34a", 246, 135, 160, -25], ["#2463eb", 246, 160, 170, -5], ["#e5484d", 246, 235, 150, 18]],
    dht: [["#16a34a", 246, 160, 160, -16], ["#e5484d", 220, 245, 175, 20]],
    wifiDht: [["#16a34a", 220, 165, 170, -16], ["#e5484d", 202, 245, 180, 20]]
  };

  elements.wireLayer.innerHTML = (lines[mode] || [])
    .map(([color, x, y, width, rotation]) => `<span class="wire" style="background:${color};left:${x}px;top:${y}px;width:${width}px;transform:rotate(${rotation}deg)"></span>`)
    .join("");
}

function hideComponents() {
  elements.servoBlock.classList.add("is-hidden");
  elements.sensorBlock.classList.add("is-hidden");
  elements.dashboardBlock.classList.add("is-hidden");
}

function updateDynamic() {
  const tp = getActiveTp();
  const elapsed = Date.now() - state.tickStart;
  hideComponents();
  setWires(tp.mode);

  if (tp.mode === "ledOn") {
    setLedStrip(1, 0, ["#e5484d"], ["D13"]);
    elements.serialBox.textContent = "LED D13: HIGH\nEtat: allumee";
  }

  if (tp.mode === "blink") {
    const on = Math.floor(elapsed / 1000) % 2 === 0;
    setLedStrip(1, on ? 0 : -1, ["#e5484d"], ["D13"]);
    elements.serialBox.textContent = `LED D13: ${on ? "HIGH" : "LOW"}\nDelai: 1000 ms`;
  }

  if (tp.mode === "chaser") {
    const active = Math.floor(elapsed / 300) % 4;
    setLedStrip(4, active, ["#e5484d", "#d97706", "#16a34a", "#2463eb"], ["D2", "D3", "D4", "D5"]);
    elements.serialBox.textContent = `Chenillard\nLED active: D${active + 2}\nDelai: 300 ms`;
  }

  if (tp.mode === "servoSweep") {
    const angles = [0, 90, 180];
    const angle = angles[Math.floor(elapsed / 1000) % angles.length];
    setLedStrip(0, -1, []);
    renderServo(angle);
    elements.serialBox.textContent = `Servo D9\nAngle: ${angle} deg\nPause: 1000 ms`;
  }

  if (tp.mode === "servoPot") {
    const angle = Math.round((state.potentiometer / 1023) * 180);
    setLedStrip(0, -1, []);
    renderServo(angle);
    elements.serialBox.textContent = `Analog A0: ${state.potentiometer}\nAngle servo: ${angle} deg`;
  }

  if (tp.mode === "ultrasonic") {
    setLedStrip(0, -1, []);
    renderDistance(false);
  }

  if (tp.mode === "ultrasonicLed") {
    const ledOn = state.distance < 10;
    setLedStrip(1, ledOn ? 0 : -1, ["#e5484d"], ["D3"]);
    renderDistance(true);
  }

  if (tp.mode === "dht") {
    setLedStrip(0, -1, []);
    renderDht(false);
  }

  if (tp.mode === "wifiDht") {
    setLedStrip(0, -1, []);
    renderDht(true);
  }
}

function renderServo(angle) {
  elements.servoBlock.classList.remove("is-hidden");
  elements.servoArm.style.transform = `rotate(${angle - 90}deg)`;
  elements.servoValue.textContent = `${angle} deg`;
}

function renderDistance(hasLed) {
  const echoMicros = Math.round(state.distance * 2 / 0.0343);
  elements.sensorBlock.classList.remove("is-hidden");
  elements.sensorLabel.textContent = "HC-SR04";
  elements.sensorValue.textContent = `${state.distance} cm`;
  elements.sensorMeter.style.width = `${Math.min(100, (state.distance / 400) * 100)}%`;
  elements.serialBox.textContent = `Trig: impulsion 10 us\nEcho: ${echoMicros} us\nDistance: ${state.distance} cm`;

  if (hasLed) {
    elements.serialBox.textContent += `\nSeuil: 10 cm\nLED D3: ${state.distance < 10 ? "ON" : "OFF"}`;
  }
}

function renderDht(withWifi) {
  elements.sensorBlock.classList.remove("is-hidden");
  elements.sensorLabel.textContent = "DHT22";
  elements.sensorValue.textContent = `${state.temperature} C / ${state.humidity} %`;
  elements.sensorMeter.style.width = `${Math.min(100, state.humidity)}%`;

  elements.serialBox.textContent = `Temperature: ${state.temperature} C\nHumidite: ${state.humidity} %`;

  if (withWifi) {
    elements.dashboardBlock.classList.remove("is-hidden");
    elements.dashboardMain.textContent = `${state.temperature} C`;
    elements.dashboardSub.textContent = `Humidite ${state.humidity} % | Wi-Fi connecte`;
    elements.serialBox.textContent += "\nWi-Fi: connecte a Wokwi-GUEST\nHTTP: donnees publiees sur /data";
  }
}

function renderAll() {
  renderStatic();
  updateDynamic();
}

elements.resetButton.addEventListener("click", resetState);
renderAll();
window.setInterval(updateDynamic, 180);
