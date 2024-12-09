import statistics

from pydantic import BaseModel, Field

from cat.experimental.form import CatForm, form, CatFormState
from cat.plugins.food_assistant import user_info_utils
from cat.plugins.food_assistant.api import ingredients_api, recipes_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client, get_ingredients_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_clear, recipe_memory_add
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget
from cat.plugins.food_assistant.shortlinks import create_shortlink


#################################
# Compare recipes by name only
#################################

class CompareRecipesByNameRequest(BaseModel):
    first_recipe_name: str
    first_recipe_confirmed: bool
    first_recipe_selected_index: int
    second_recipe_name: str
    second_recipe_confirmed: bool
    second_recipe_selected_index: int


@form
class CompareRecipesByNameForm(CatForm):
    name = "CompareRecipesByNameForm"
    description = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.description')

    model_class = CompareRecipesByNameRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.stop_examples')
    ask_confirm = False
    recipes_search_results = {
        'first': [{'score': 0}],
        'second': [{'score': 0}]
    }

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.form_closed_message')
            }

        model = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            # Ask for the first recipe info (name or ingredients) if none is available
            if 'first_recipe_name' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.missing_recipe1_name_message'),
                }

            # If first recipe info are based on the name we ask confirmation by searchig for it
            if 'first_recipe_name' in model and not self.is_recipe_confirmed('first'):
                return self.confirm_recipe_by_name_step(model, 'first')

            # Ask for the second recipe info (name or ingredients) if none is available
            if 'second_recipe_name' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.missing_recipe2_name_message')
                }

            # If second recipe info are based on the name we ask confirmation by searchig for it
            if 'second_recipe_name' in model and not self.is_recipe_confirmed('second'):
                return self.confirm_recipe_by_name_step(model, 'second')

        out = f"""
        Current: {model}.
        Missing: {missing_fields}.
        Invalid: {errors}
        """

        return {
            "output": out
        }

    def is_recipe_confirmed(self, recipe_num):
        model = self._model
        return f'{recipe_num}_recipe_confirmed' in model and model[f'{recipe_num}_recipe_confirmed']

    def confirm_recipe_by_name_step(self, model: dict, recipe_num: str):
        keywords = recipes_api.extract_keywords_from_recipe_name(self.cat, model[f"{recipe_num}_recipe_name"])

        response = get_recipes_api_client(self.cat).search_by_name(keywords, 100, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        print(recipes)
        if len(recipes) == 0:
            name = self._model[f'{recipe_num}_recipe_name']
            del self._model[f'{recipe_num}_recipe_name']
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.recipe_not_found_message', {
                    'name': name
                })
            }

        widget_recipes = []
        for i in range(0, min(5, len(recipes))):
            ingredients = [ingr['name'] for ingr in recipes[i]['ingredients_list']]
            widget_recipes.append({
                'index': i,
                'name': recipes[i]['title'],
                'score': recipes[i]['score'],
                'image_url': create_shortlink(recipes[i]['image_url']),
                'health_labels': recipes[i]['health_labels'],
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
                'serving_kcal': recipes[i]['serving_kcal']
            })

        self.recipes_search_results[recipe_num] = widget_recipes

        return {
            "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.recipe_confirmation_message', {
                'name': model[f'{recipe_num}_recipe_name'],
                'widget': custom_list_group_widget('recipes', widget_recipes, 'index')
            })
        }

    def submit(self, form_data):  #

        recipe1 = self.recipes_search_results['first'][self._model['first_recipe_selected_index']]
        recipe2 = self.recipes_search_results['second'][self._model['second_recipe_selected_index']]

        recipe_memory_clear(self.cat)
        recipe_memory_add(self.cat, recipe1)
        recipe_memory_add(self.cat, recipe2)

        # Generate response
        recipe1_score = recipe1['score']
        recipe2_score = recipe2['score']

        scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.recipe_same_sus_score')
        if recipe1_score < recipe2_score:
            scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.recipe1_better_sus_score')
        elif recipe1_score > recipe2_score:
            scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.recipe2_better_sus_score')

        first_recipe_ingredients = '\n'.join(recipe1['ingredients'])
        second_recipe_ingredients = '\n'.join(recipe2['ingredients'])

        fp_user_info = user_info_utils.load_user_info_from_json(self.cat.user_id)
        user_info_str = []
        for k in fp_user_info:
            user_info_str.append(f"{k} = {fp_user_info[k]}")
        user_info_str = '\n'.join(user_info_str)

        prompt = translate(DEFAULT_LANGUAGE, 'CompareRecipesByNameForm.result_argumentation_prompt', {
            'first_recipe_ingredients': first_recipe_ingredients,
            'second_recipe_ingredients': second_recipe_ingredients,
            'recipe1_score': recipe1_score,
            'recipe2_score': recipe2_score,
            'scores_result': scores_result,
            'user_info': user_info_str
        })

        return {
            "output": self.cat.llm(prompt)
        }
