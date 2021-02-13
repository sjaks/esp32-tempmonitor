#      _       _        
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

import time
import requests
import threading
from w1thermsensor import W1ThermSensor


TOKEN = "secret" # change to a secure password
ENTRYPOINT = "https://jaks.fi/temperature/post"
SENSOR = W1ThermSensor()


# Helper for periodical function calls
def setInterval(func, interval):
    ev = threading.Event()
    while not ev.wait(interval):
        func()


# Read temperature sensor and send value to entrypoint
def send_temp():
    temp = SENSOR.get_temperature()
    payload = {"timestamp": time.time(), "temp": temp, "secret": TOKEN}
    print(payload)
    req = requests.get(url = ENTRYPOINT, params = payload)


def main():
    send_temp()
    setInterval(send_temp, 600)


main()
