# ESP32 Temperature Monitor

Very simple ESP32 temperature monitor with a barebones frontend

### Deploying
This is intended to be used as a base for developing your own temperature
station/frontend combination. Change the secret, production host in `.env`
to fit your use case and use Apache or Nginx to point to the port `10990`.

Edit the `ESP32.ino` file so that it points to your production API endpoint
and has the same secret as your backend server. Also remember to fill in
your WiFi credentials.

###  ESP32 dependencies
In order to develop this in Arduino IDE, you'll need to import ESP32 libraries by including this in the *Additional Boards Manager URLs*:
```
https://dl.espressif.com/dl/package_esp32_index.json, http://arduino.esp8266.com/stable/package_esp8266com_index.json
```

After that you'll need to install `OneWire by Paul Stoffregen` and `DallasTemperature by Miles Burton`. Make needed changes to the .ino file, compile and flash onto your ESP.
