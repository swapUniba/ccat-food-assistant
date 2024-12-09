from cat.plugins.food_assistant.fux_http_client import get_fux_http_client


class RecipesApiClient:
    def __init__(self, cat):
        self.cat = cat

    def search_by_name(self, query: str, sustainabilityWeight: int, useCfi: bool):
        return get_fux_http_client(self.cat).get('/recipes-search/by-name', {
            'query': query,
            'sustainabilityWeight': sustainabilityWeight,
            'useCfi': 1 if useCfi else 0,
        })


    def search_by_ingredients(self, query: str, sustainabilityWeight: int, useCfi: bool):
        return get_fux_http_client(self.cat).get('/recipes-search/by-ingredients', {
            'query': query,
            'sustainabilityWeight': sustainabilityWeight,
            'useCfi': 1 if useCfi else 0,
        })
