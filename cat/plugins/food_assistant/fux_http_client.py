import requests

from cat.plugins.food_assistant.fux_response import FuxResponse


class FuxHttpClient:
    base_url = ''
    http_user = ''
    http_pwd = ''
    room_id = ''

    def __init__(self, base_url):
        self.base_url = base_url

    def get(self, route, params=None):
        if params is None:
            params = {}
        response = requests.get(self.base_url + route, params=params)

        if response.status_code != 200:
            return FuxResponse.from_dict(
                {"status": FuxResponse.ERROR, "message": "Scusami, ma qualcosa è andato storto... riprova più tardi"})

        return FuxResponse.from_dict(response.json())

    def post(self, route, body):
        # Send the POST request
        response = requests.post(self.base_url + route, json=body if isinstance(body, dict) else None,
                                 data=body if isinstance(body, str) else None)
        if response.status_code != 200:
            return FuxResponse.from_dict(
                {"status": FuxResponse.ERROR, "message": "Scusami, ma qualcosa è andato storto... riprova più tardi"})
        return FuxResponse.from_dict(response.json())


def get_fux_http_client(cat):
    settings = cat.mad_hatter.get_plugin().load_settings()
    return FuxHttpClient(settings['food_print_base_url'])
