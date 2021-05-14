# tempbodge: temp fetcher
# sjaks@github.com

import os
from datetime import datetime
import requests
from w1thermsensor import W1ThermSensor
from dotenv import load_dotenv


# Load env vars from .env
load_dotenv()


# Define constants
TOKEN = os.getenv("SECRET")
ENTRYPOINT = os.getenv("HOST") + "/post"
SENSOR_IN = W1ThermSensor.get_available_sensors()[0]
SENSOR_OUT = W1ThermSensor.get_available_sensors()[1]


# Get current time and temperature reading from the GPIO
# and post to the server
curtime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
temp_in = SENSOR_IN.get_temperature()
temp_out = SENSOR_OUT.get_temperature()

payload = {"timestamp": curtime, "temp": temp_in, "outdoors": temp_out, "secret": TOKEN}
req = requests.get(url = ENTRYPOINT, params = payload)
