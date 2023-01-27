#include <WiFi.h>
#include <HTTPClient.h>


TaskHandle_t Task1;
TaskHandle_t Task2;


int sensorPin = 33;
long delayTime = 2000;
String baseUrl = "http://192.168.31.208:8080";
String serverName = baseUrl + "/update-sensor";
const char* ssid = "Xiaomi_2CC1";
const char* password = "@1122334455667788@";


void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  delayTime = getDelayTime();

  Serial.print("delayTime set to ");
  Serial.println(delayTime);


  //create a task that will be executed in the Task2code() function, with priority 1 and executed on core 1
  xTaskCreatePinnedToCore(
    Task2code, /* Task function. */
    "Task2",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task2,    /* Task handle to keep track of created task */
    0);        /* pin task to core 1 */
  delay(500);

  xTaskCreatePinnedToCore(
    Task1code, /* Task function. */
    "Task1",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task1,    /* Task handle to keep track of created task */
    1);        /* pin task to core 0 */
  delay(500);
}

int potValue = 0;
void Task1code(void* pvParameters) {
  Serial.print("Task1 running on core ");
  Serial.println(xPortGetCoreID());

  for (;;) {
    potValue = analogRead(sensorPin);
    Serial.print("sensor value: ");
    Serial.println(potValue);
    delay(delayTime);
  }
}

void Task2code(void* pvParameters) {
  Serial.print("Task2 running on core ");
  Serial.println(xPortGetCoreID());

  for (;;) {
    long temp = getDelayTime();
    if (temp != delayTime) {
      delayTime = temp;
      Serial.print("Delay time changed to: ");
      Serial.println(delayTime);
    }
    delay(1000);
  }
}


int getSensorValue() {
  int potValue = analogRead(sensorPin);
  return potValue;
}

long getDelayTime() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String delayTimeUrl = baseUrl + "/getDelayTime";
    http.begin(delayTimeUrl.c_str());
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      return payload.toInt();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WIfi disconneced.");
  }
  return 2000;
}

void loop() {
}
