# TempBodge

Very simple ESP32 temperature monitor with a barebones frontend

### Deploying
This is intended to be used as a base for developing your own temperature
station/frontend combination. Change the secret, production host in `.env`
to fit your use case and use Apache or Nginx to point to the port `10990`.

Edit the `ESP32.ino` file so that it points to your production API endpoint
and has the same secret as your backend server. Also remember to fill in
your WiFi credentials.
