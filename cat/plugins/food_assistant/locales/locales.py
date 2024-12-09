from cat.plugins.food_assistant.locales.en import locale as en
from cat.plugins.food_assistant.locales.it import locale as it

DEFAULT_LANGUAGE = "en"


def translate(lang: str, key: str, data: dict = None):
    if lang == "en":
        text = en[key]
    if lang == "it":
        text = it[key]
    else:
        text = en[key]

    if data is not None:
        for k in data:
            text = text.replace("{" + k + "}", str(data[k]))
    return text
