#include <WiFi.h>
#include <HTTPClient.h>


TaskHandle_t Task1;
TaskHandle_t Task2;


int sensorPin = 33;
long delayTime = 2000;
String baseUrl = "http://rasp.local";
String serverName = baseUrl + "/update-sensor";
const char* ssid = "Xiaomi_2CC1";
const char* password = "@1122334455667788@";
bool collectData = false;


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
  collectData = getCollectData();

  Serial.print("delayTime set to ");
  Serial.println(delayTime);

  Serial.print("collecData set to ");
  Serial.println(collectData);


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
    if (collectData) {
      int value = getSensorValue();
      sendData(value);      
    }
    delay(delayTime);
  }
}

void Task2code(void* pvParameters) {
  Serial.print("Task2 running on core ");
  Serial.println(xPortGetCoreID());

  for (;;) {
    long temp = getDelayTime();
    long tempCollectData = getCollectData();

    if ( tempCollectData != collectData){
      collectData = tempCollectData;
      Serial.print("Setting collect data to: ");
      Serial.println(collectData);
    }

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

bool getCollectData() {

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String delayTimeUrl = baseUrl + "/getRequestData";
    http.begin(delayTimeUrl.c_str());
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      return payload == "true";
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WIfi disconneced.");
  }

  return false;
}


void sendData(int value){
  if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      String serverPath = serverName + "?sensor1="+value;
      http.begin(serverPath.c_str());
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.print("value: ");
        Serial.print(value);
        Serial.println(" was sent to the server.");
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
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
  return delayTime;
}

void loop() {
}
