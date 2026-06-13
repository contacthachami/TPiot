#include <Servo.h>

const byte SERVO_PIN = 9;
const byte POT_PIN = A0;

Servo monServo;

void setup() {
  monServo.attach(SERVO_PIN);
}

void loop() {
  int valeurPot = analogRead(POT_PIN);
  int angle = map(valeurPot, 0, 1023, 0, 180);

  monServo.write(angle);
  delay(15);
}
