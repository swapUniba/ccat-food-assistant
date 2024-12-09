import requests

from cat.plugins.food_assistant.api.edamam.api_key_utils import get_edamam_credentials
from cat.plugins.food_assistant.api.recipes_api import create_recipe_with_llm_by_name, \
    create_recipe_with_llm_by_ingredients
from cat.plugins.food_assistant.fux_response import FuxResponse
from cat.plugins.food_assistant.locales.locales import DEFAULT_LANGUAGE

EDAMAM_EMISSION_CLASSES = {
    "A+": 1, "A": 2, "B": 3, "C": 4, "D": 5, "E": 6, "F": 7, "G": 8
}


def edamam_emission_class_to_int(emission_class: str) -> int:
    return EDAMAM_EMISSION_CLASSES[emission_class] if emission_class in EDAMAM_EMISSION_CLASSES else 9999


def int_to_edamam_emission_class(num: int) -> str:
    for cls in EDAMAM_EMISSION_CLASSES:
        if num == EDAMAM_EMISSION_CLASSES[cls]:
            return cls
    return 'G'


class RecipesApiClient:
    def __init__(self, cat):
        self.cat = cat
        self.max_recipes = 5
        self.settings = cat.mad_hatter.get_plugin().load_settings()

    def search_by_name(self, query: str, sustainabilityWeight: int, useCfi: bool, fallback_llm: bool = True):
        emission_classes = list(EDAMAM_EMISSION_CLASSES.keys())
        recipes = []
        current_class_idx = 0
        while len(recipes) < self.max_recipes and current_class_idx < len(emission_classes):
            credentials = get_edamam_credentials()
            results = self._search(query, credentials['app_id'], credentials['app_key'], credentials['user'],
                                   emission_classes[current_class_idx])
            print(results)
            for recipe in results:
                if not any(r['title'] == recipe['title'] and r['image_url'].split('?')[0] ==
                           recipe['image_url'].split('?')[0] for r in recipes):
                    recipes.append(recipe)

            current_class_idx += 1

        if len(recipes) == 0 and fallback_llm == True:
            llm_recipe = create_recipe_with_llm_by_name(self.cat, query)
            if llm_recipe is not None:
                recipes.append(llm_recipe)

        return FuxResponse.from_dict({"status": FuxResponse.SUCCESS, "data": {"data": recipes}})

    def search_by_ingredients(self, query: str, sustainabilityWeight: int, useCfi: bool, fallback_llm: bool = True):
        response = self.search_by_name(query, sustainabilityWeight, useCfi, False)
        if len(response.get_data()["data"]) == 0 and fallback_llm == True:
            llm_recipe = create_recipe_with_llm_by_ingredients(self.cat, query)
            response.set_data({"data": [llm_recipe]})
        return response

    def _search(self, query, app_id, app_key, user, minimum_CO2e_class):
        """
        Search for recipes and extract ingredients using the Edamam Recipe API.

        Parameters:
        - query (str): The search keywords (e.g., 'chicken soup').
        - app_id (str): Your Edamam Application ID.
        - app_key (str): Your Edamam Application Key.

        Returns:
        - list: A list of recipes with their ingredients.
        """
        url = 'https://api.edamam.com/api/recipes/v2'
        params = {
            'type': 'public',
            'q': query,
            'app_id': app_id,
            'app_key': app_key,
            'beta': True,
            'co2EmissionsClass': minimum_CO2e_class,
            'imageSize': ['SMALL']
        }

        headers = {
            'Accept-Language': DEFAULT_LANGUAGE,
            'Edamam-Account-User': user
        }

        try:
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()  # Raise an error for bad status codes
            data = response.json()
            recipes = data.get('hits', [])
            # Extract recipe details along with ingredients
            result = []
            for hit in recipes:
                recipe = hit['recipe']
                recipe_info = {
                    'title': recipe['label'],
                    'uri': recipe['uri'],
                    'url': recipe['url'],
                    'image_url': recipe['images']['SMALL']['url'],
                    'ingredients_list': [{'name': ingredient['food'], 'score': 0} for ingredient in
                                         recipe['ingredients']],
                    'diet_labels': recipe['dietLabels'],
                    'health_labels': recipe['healthLabels'],
                    'co2_emissions_class': recipe['co2EmissionsClass'],
                    'total_co2_emissions': recipe['totalCO2Emissions'],
                    'score': edamam_emission_class_to_int(recipe['co2EmissionsClass']),
                    'serving_kcal': recipe['calories'] / recipe['yield']
                }
                result.append(recipe_info)
            return result
        except requests.exceptions.HTTPError as errh:
            print(f'HTTP Error: {errh}')
        except requests.exceptions.ConnectionError as errc:
            print(f'Error Connecting: {errc}')
        except requests.exceptions.Timeout as errt:
            print(f'Timeout Error: {errt}')
        except requests.exceptions.RequestException as err:
            print(f'OOps: Something Else {err}')

        return []
