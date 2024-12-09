from cat.plugins.food_assistant.fux_http_client import get_fux_http_client


class IngredientsApiClient:

    def __init__(self, cat):
        self.cat = cat

    def get_score(self, ingredients_list: str, separator: str):
        return [0 for _ in range(len(ingredients_list))]
