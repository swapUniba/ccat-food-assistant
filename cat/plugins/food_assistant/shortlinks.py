import json

# Default user info structure
import os

import requests

from cat.plugins.food_assistant.fux_response import FuxResponse


def create_shortlink(url):
    body = {
        "url": url,
        "api_key": "OPd6gnEwamFlkemvbzefh3Blj7Z2OXRjMnFrd2qweRT="
    }
    response = requests.post("http://host.docker.internal:8080/shortlinks/api/v1/create", json=body)
    if response.status_code != 200:
        return url
    print(response.text)
    return FuxResponse.from_dict(response.json()).get_data()
