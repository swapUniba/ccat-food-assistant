from cat.plugins.food_assistant.fux_http_client import get_fux_http_client


class IngredientsApiClient:

    def __init__(self, cat):
        self.cat = cat

    def get_score(self, ingredients_list: str, separator: str):
        return get_fux_http_client(self.cat).get('/assistant/ingredients/get-score', {
            'ingredients_csv': ingredients_list,
            'separator': separator
        })
