import os

import requests
from pydantic import BaseModel

from cat.experimental.form import CatForm, form, CatFormState
from cat.log import log
from cat.mad_hatter.decorators import tool, hook
from cat.plugins.food_assistant.api import recipes_api, ingredients_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_clear, recipe_memory_add
from cat.plugins.food_assistant.fux_http_client import get_fux_http_client
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget
from cat.plugins.food_assistant.shortlinks import create_shortlink


#################################
# Search recipes by name
#################################

class SearchRecipesByNameRequest(BaseModel):
    recipe_name: str


@form
class SearchRecipesByNameForm(CatForm):
    name = "SearchRecipesByNameForm"
    description = translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.description')
    model_class = SearchRecipesByNameRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.stop_examples')
    ask_confirm = False

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.form_closed_message')
            }

        current_fields = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            if missing_fields[0] == 'recipe_name':
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.missing_recipe_name_message')
                }

        out = f"""
        Current: {current_fields}.
        Missing: {missing_fields}.
        Invalid: {errors}
        """

        return {
            "output": out
        }

    def submit(self, form_data):  #
        keywords = recipes_api.extract_keywords_from_recipe_name(self.cat, form_data['recipe_name'])

        response = get_recipes_api_client(self.cat).search_by_name(keywords, 100, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        if len(recipes) == 0:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.recipe_not_found_message')
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
                'url':  create_shortlink(recipes[i]['url']),
                'health_labels': recipes[i]['health_labels'],
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
            }
            widget_recipes.append(recipe)
            recipe_memory_add(self.cat, recipe)

        return {
            "output": translate(DEFAULT_LANGUAGE, 'SearchRecipesByNameForm.found_recipes_message', {
                'widget': custom_list_group_widget('recipes', widget_recipes, '')
            })
        }
