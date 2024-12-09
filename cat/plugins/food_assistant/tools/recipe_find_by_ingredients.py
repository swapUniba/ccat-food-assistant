import json
import os

import requests
from pydantic import BaseModel

from cat.experimental.form import CatForm, form, CatFormState
from cat.mad_hatter.decorators import tool, hook
from cat.plugins.food_assistant.api import recipes_api, ingredients_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_clear, recipe_memory_add
from cat.plugins.food_assistant.fux_http_client import get_fux_http_client
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget
from cat.plugins.food_assistant.shortlinks import create_shortlink


#################################
# Search recipes by ingredients
#################################

class SearchRecipesByIngredientsRequest(BaseModel):
    ingredients_csv: str


@form
class SearchRecipesByIngredientsForm(CatForm):
    name = "SearchRecipesByIngredientsForm"
    description = translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.description')
    model_class = SearchRecipesByIngredientsRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.stop_examples')
    ask_confirm = False
    translated = False

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.form_closed_message')
            }

        current_fields = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            if missing_fields[0] == 'ingredients_csv':
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.missing_ingredients_message')
                }

        out = f"""
        Current: {current_fields}.
        Missing: {missing_fields}.
        Invalid: {errors}
        """

        return {
            "output": out
        }

    def sanitize(self, model):
        model = super().sanitize(model)
        try:
            if not self.translated and DEFAULT_LANGUAGE != 'en':
                if 'ingredients_csv' in model and model['ingredients_csv'] != '' and model['ingredients_csv'] is not None:
                    json_structure = "{\"ingredients_csv\": \"<csv ingredients list here>\"}"
                    response = self.cat.llm(f"""
                    Your task is to translate the following csv ingredients list written in {DEFAULT_LANGUAGE} language in english.
                    Maybe some ingredient's names are already in english.
                    Return the ingredients csv list in a JSON structure like the following:
                    ```json
                    {json_structure}
                    ```
                    The csv ingredients list is the following:
                    {model['ingredients_csv']}
                    Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
                    Your response is:
                    ```json
                    """)
                    print(response)
                    response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
                    if 'ingredients_csv' in response_json and response_json['ingredients_csv'] != '' and response_json['ingredients_csv'] is not None:
                        model['ingredients_csv'] = response_json['ingredients_csv']
                        self.translated = True
        except Exception as e:
            print(e)
        return model

    def submit(self, form_data):  #

        response = get_recipes_api_client(self.cat).search_by_ingredients(';'.join(
            [ingr.strip() for ingr in form_data['ingredients_csv'].split(',')]), 100, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        if len(recipes) == 0:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.recipe_not_found_message')
            }

        widget_recipes = []
        recipe_memory_clear(self.cat)
        for i in range(0, min(5, len(recipes))):
            ingredients = [ingr['name'] for ingr in recipes[i]['ingredients_list']]
            recipe = {
                'index': i,
                'name': recipes[i]['title'],
                'score': recipes[i]['score'],
                'image_url': create_shortlink(recipes[i]['image_url']),
                'url': create_shortlink(recipes[i]['url']),
                'health_labels': recipes[i]['health_labels'],
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
            }
            widget_recipes.append(recipe)
            recipe_memory_add(self.cat, recipe)

        return {
            "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByIngredientsForm.found_recipes_message', {
                'widget': custom_list_group_widget('recipes', widget_recipes, '')
            }),
        }
