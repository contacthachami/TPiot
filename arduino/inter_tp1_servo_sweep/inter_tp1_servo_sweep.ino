#include <Servo.h>

const byte SERVO_PIN = 9;
const unsigned int PAUSE_MS = 1000;

Servo monServo;

void setup() {
  monServo.attach(SERVO_PIN);
}

void loop() {
  monServo.write(0);
  delay(PAUSE_MS);

  monServo.write(90);
  delay(PAUSE_MS);

  monServo.write(180);
  delay(PAUSE_MS);
}
