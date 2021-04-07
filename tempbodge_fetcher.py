#       _       _
#  ___ (_) __ _| | _____  sjaks@github
# / __|| |/ _` | |/ / __| jaks.fi
# \__ \| | (_| |   <\__ \ ------------
# |___// |\__,_|_|\_\___/ tempbodge
#    |__/
#
# BRIEF:
# Reads the W1 temp sensor and sends
# values to cloud. Depends on:
# apt-get install python3-w1thermsensor

from datetime import datetime
import requests
from w1thermsensor import W1ThermSensor


TOKEN = "secret" # change to a secure password
ENTRYPOINT = "https://jaks.fi/temperature/post"
SENSOR = W1ThermSensor()


# Get current time and temperature reading from the GPIO
# and post to the server
curtime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
temp = SENSOR.get_temperature()
payload = {"timestamp": curtime, "temp": temp, "secret": TOKEN}
req = requests.get(url = ENTRYPOINT, params = payload)
