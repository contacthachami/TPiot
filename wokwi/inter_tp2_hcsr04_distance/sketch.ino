const byte TRIG_PIN = 9;
const byte ECHO_PIN = 10;
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
  Serial.begin(9600);
}

void loop() {
  float distance = mesurerDistanceCm();

  if (distance < 0) {
    Serial.println("Distance: hors plage");
  } else {
    Serial.print("Distance: ");
    Serial.print(distance, 1);
    Serial.println(" cm");
  }

  delay(500);
}
