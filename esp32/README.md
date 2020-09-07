# Rice Cooker

Python code for the DOIT ESP32 Devkit V1 to push sensor data to a local

## Configuration

You need to supply a `wifi_config.py` file in this directory before
compiling and uploading via Zerynth Studio, like so:

```python
HOST = "<URL to post data to>"
SSID = "<wifi name>"
PASSWORD = "<wifi password>"
```
