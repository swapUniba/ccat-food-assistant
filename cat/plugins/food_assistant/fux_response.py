import json


class FuxResponse:
    ERROR = 'ERROR'
    SUCCESS = 'OK'
    CONFIRM = 'CONFIRM'

    def __init__(self, status=None, message=None, data=None, can_be_pretty=False):
        self.response = {}
        if status is not None:
            self.response['status'] = status
        if message is not None:
            self.response['message'] = message
        if data is not None:
            self.response['data'] = data
        self.can_be_pretty = can_be_pretty

    def __str__(self):
        return json.dumps(self.response)

    def is_ok(self):
        return self.response.get('status') == self.SUCCESS

    def is_error(self):
        return self.response.get('status') == self.ERROR

    def is_confirm(self):
        return self.response.get('status') == self.CONFIRM

    def is_pretty(self):
        return self.can_be_pretty

    def get_message(self):
        return self.response.get('message')

    def set_message(self, message):
        self.response['message'] = message

    def get_data(self):
        return self.response.get('data')

    def set_data(self, data):
        self.response['data'] = data

    def get_status(self):
        return self.response.get('status')

    def set_status(self, status):
        self.response['status'] = status

    def json_serialize(self):
        return self.response

    @classmethod
    def from_dict(cls, dictionary):
        status = dictionary.get("status", None)
        message = dictionary.get("message", None)
        data = dictionary.get("data", None)
        return cls(status, message, data)

    @staticmethod
    def success(message=None, data=None):
        return FuxResponse(FuxResponse.SUCCESS, message, data)

    @staticmethod
    def error(message=None, data=None):
        return FuxResponse(FuxResponse.ERROR, message, data)
