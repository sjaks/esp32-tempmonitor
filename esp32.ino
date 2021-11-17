// esp32-tempmonitor ESP32 sketch
// sjaks@github.com


#include <WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <HTTPClient.h>
#include "time.h"


// NTP info
const char* ntpServer = "pool.ntp.org";
unsigned long timestamp;


// WiFi credentials
String hostname = "thermometer";
const char* ssid = "SSID";
const char* password =  "PASSWORD";


// esp32-tempmonitor remote endpoint info
const String endpoint = "https://sjaks.dy.fi/temperature/post";
const String secret = "SECRET";

// OneWire bus info
const int oneWireBus = 4;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);


// Function for getting current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;

  if (!getLocalTime(&timeinfo)) {
    return(0);
  }

  time(&now);
  return now;
}


void setup() {
  // Wait a while and connect to Wifi
  Serial.begin(115200);
  delay(4000);
  WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE, INADDR_NONE);
  WiFi.setHostname(hostname.c_str());
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }

  // Setup the NTP object
  configTime(0, 0, ntpServer);
}


void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {
    HTTPClient http;

    // Get data
    timestamp = getTime();
    sensors.requestTemperatures(); 
    String temperatureValue = String(sensors.getTempCByIndex(0), 2);

    // Construct the full URL with params
    String payload = "?secret=" + secret;
    payload += "&timestamp=" + String(timestamp);
    payload += "&temp=" + temperatureValue;

    // Make request to the API endpoint and send data
    http.begin(endpoint + payload);
    int httpCode = http.GET();

    // Check for errors in the request
    if (httpCode > 0) {
      Serial.println("HTTP: Success!");
    } else {
      Serial.println("HTTP: Error!");
    }

    http.end();
  }

  // Post every 5 minutes
  delay(300000);
}
