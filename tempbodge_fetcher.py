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
#   apt-get install \
#   python3-w1thermsensor \
#   python3-schedule

from datetime import datetime
import requests
import schedule
import time
from w1thermsensor import W1ThermSensor


TOKEN = "secret" # change to a secure password
ENTRYPOINT = "https://jaks.fi/temperature/post"
SENSOR = W1ThermSensor()


# Read temperature sensor and send value to entrypoint
def send_temp():
    temp = SENSOR.get_temperature()
    curtime = datetime.now().strftime("%d/%m/%Y %H:%M")
    payload = {"timestamp": curtime, "temp": temp, "secret": TOKEN}
    print(payload)
    req = requests.get(url = ENTRYPOINT, params = payload)


# Init a scheduler and send temps every 5 minutes
schedule.every(5).minutes.do(send_temp)
while True:
    schedule.run_pending()
    time.sleep(1)
