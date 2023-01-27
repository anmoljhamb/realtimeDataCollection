int sensorPin = 15;

void setup() {
  Serial.begin(115200);
}

void loop() {

}

int getSensorValue(){
  return analogRead(sensorPin);
}