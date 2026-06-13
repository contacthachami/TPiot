const byte LED_PINS[] = {2, 3, 4, 5};
const byte LED_COUNT = sizeof(LED_PINS) / sizeof(LED_PINS[0]);
const unsigned int STEP_DELAY_MS = 300;

void setup() {
  for (byte i = 0; i < LED_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void loop() {
  for (byte i = 0; i < LED_COUNT; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(STEP_DELAY_MS);
    digitalWrite(LED_PINS[i], LOW);
  }
}
