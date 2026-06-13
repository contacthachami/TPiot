const byte TRIG_PIN = 9;
const byte ECHO_PIN = 10;
const byte LED_PIN = 3;
const float DISTANCE_ALERTE_CM = 10.0;
const unsigned long ECHO_TIMEOUT_US = 30000UL;

float mesurerDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duree = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  if (duree == 0) {
    return -1.0;
  }

  return duree * 0.0343 / 2.0;
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  float distance = mesurerDistanceCm();
  bool obstacleProche = distance > 0 && distance < DISTANCE_ALERTE_CM;

  digitalWrite(LED_PIN, obstacleProche ? HIGH : LOW);

  if (distance < 0) {
    Serial.println("Distance: hors plage");
  } else {
    Serial.print("Distance: ");
    Serial.print(distance, 1);
    Serial.print(" cm | LED: ");
    Serial.println(obstacleProche ? "ON" : "OFF");
  }

  delay(200);
}
