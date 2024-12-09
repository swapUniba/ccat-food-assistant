import json


def list_group_widget(semantic_type: str, items: list, return_key: str = "", label_key: str = ""):
    """
    Create a widget string to be embedded inside the assistant response message in order to display a list group of
    clickable items that should generate a standardized response once clicked

    :param semantic_type: is a string that can be used in order to display correctly the given items
    :param items: a list of dictionary
    :param return_key: a key of the dictionary that should be returned when a list item is clicked/activated from UI
    :return: str
    """
    return f"""<widget semtype="{semantic_type}" type="list-group" return="{return_key}" label="{label_key}"><json>{json.dumps(items)}</json></widget>"""


def custom_list_group_widget(semantic_type: str, items: list, return_key: str = ""):
    """
    Create a widget string to be embedded inside the assistant response message in order to display a list group of
    users

    :param semantic_type: is a string that can be used in order to display correctly the given items
    :param items: a list of dictionary
    :param return_key: the key that will be used to retrieve the return value after item is clicked
    :return: str
    """
    return f"""<widget semtype="{semantic_type}" type="list-group" return="{return_key}"><json>{json.dumps(items)}</json></widget>"""


def buttons_list_widget(buttons: list):
    """
    Create a buttons list widget. Each button has a label and a corresponding return value that will be prompted to the
    assistant

    :param buttons: a list of buttons with following structure {label: "Click Me!", return:"This is prompted to LLM"}
    :return: str
    """
    return f"""<widget type="buttons-list"><json>{json.dumps(buttons)}</json></widget>"""
