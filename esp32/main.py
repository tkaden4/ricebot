# Rice Cooker Sensor
# Created at 2020-09-02 20:56:15.344346

from espressif.esp32net import esp32wifi
from wireless import wifi
from . import wifi_config
import adc
import requests
import streams

streams.serial()
esp32wifi.auto_init()
pinMode(LED0, OUTPUT)


def onError(delay):
    while True:
        digitalWrite(LED0, HIGH)
        sleep(delay)
        digitalWrite(LED0, LOW)
        sleep(delay)


for retry in range(10):
    try:
        wifi.link(wifi_config.SSID, wifi.WIFI_WPA2, wifi_config.PASSWORD)
        break
    except Exception as e:
        onError(100)

if not wifi.is_linked():
    onError(200)
else:
    digitalWrite(LED0, HIGH)
    while True:
        try:
            values = []
            for i in range(200):
                values.append(adc.read(A3))
            requests.post(wifi_config.HOST, json={
                "min": min(values),
                "max": max(values),
                "avg": sum(values)/len(values)
            })
        except Exception as e:
            print(e)
