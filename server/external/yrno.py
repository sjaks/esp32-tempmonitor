import requests

class Yrno():
    URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=61.45&lon=23.85";
    data = "";
    time = "";

    def update_yrno(self):
        r = requests.get(url = self.URL, headers={'User-Agent': 'esp32-tempmonitor',})
        self.data = r.json()['properties']['timeseries'][0]['data']['instant']['details']['air_temperature']
        self.time = r.json()['properties']['timeseries'][0]['time']

    def get_yrno_temps(self):
        return str(self.data)

    def get_yrno_timestamp(self):
        return str(self.time)