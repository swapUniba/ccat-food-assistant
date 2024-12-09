import json
import statistics

from pydantic import BaseModel, Field

from cat.experimental.form import CatForm, form, CatFormState
from cat.plugins.food_assistant import user_info_utils
from cat.plugins.food_assistant.api import ingredients_api, recipes_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client, get_ingredients_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_clear, recipe_memory_add
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget


#################################
# Compare recipes
#################################

class CompareRecipesRequest(BaseModel):
    first_recipe_ingredients_list_psv: str = Field(..., description=translate(DEFAULT_LANGUAGE,
                                                                              'CompareRecipesForm.model.first_recipe_ingredients_list_psv'))
    first_recipe_name: str
    first_recipe_confirmed: bool
    second_recipe_ingredients_list_psv: str = Field(..., description=translate(DEFAULT_LANGUAGE,
                                                                               'CompareRecipesForm.model.second_recipe_ingredients_list_psv'))
    second_recipe_name: str
    second_recipe_confirmed: bool


@form
class CompareRecipesForm(CatForm):
    name = "CompareRecipesForm"
    description = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.description')
    model_class = CompareRecipesRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.stop_examples')
    ask_confirm = False
    translated = {
        'first': False,
        'second': False,
    }

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.form_closed_message')
            }

        model = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            # Ask for the first recipe info (name or ingredients) if none is available
            if 'first_recipe_ingredients_list_psv' in missing_fields and 'first_recipe_name' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.missing_ingredients_message1'),
                }

            # If first recipe info are based on the name we ask confirmation by searchig for it
            if 'first_recipe_name' in model and not self.is_recipe_confirmed('first'):
                return self.confirm_recipe_by_name_step(model, 'first')

            # Ask for the second recipe info (name or ingredients) if none is available
            if 'second_recipe_ingredients_list_psv' in missing_fields and 'second_recipe_name' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.missing_ingredients_message2')
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
        if len(recipes) == 0:
            name = self._model[f'{recipe_num}_recipe_name']
            del self._model[f'{recipe_num}_recipe_name']
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.recipe_not_found_message', {
                    'name': name
                })
            }

        widget_recipes = []
        for i in range(0, min(5, len(recipes))):
            ingredients = [ingr['name'] for ingr in recipes[i]['ingredients_list']]
            widget_recipes.append({
                'index': i,
                'name': recipes[i]['title'],
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
            })

        return {
            "output": translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.recipe_confirmation_message', {
                'name': model[f'{recipe_num}_recipe_name'],
                'widget': custom_list_group_widget('recipes', widget_recipes, 'index')
            })
        }

    def sanitize(self, model):
        model = super().validate(model)
        if 'first_recipe_confirmed' not in model and 'first_recipe_name' not in model and 'first_recipe_ingredients_list_psv' in model:
            model['first_recipe_confirmed'] = True
            model['first_recipe_name'] = '-'
        if 'second_recipe_confirmed' not in model and 'second_recipe_name' not in model and 'second_recipe_ingredients_list_psv' in model:
            model['second_recipe_confirmed'] = True
            model['second_recipe_name'] = '-'

        model = self.translate_ingredients(model, 'first')
        model = self.translate_ingredients(model, 'second')

        return model

    def translate_ingredients(self, model: dict, recipe_num: str):
        try:
            if not self.translated[recipe_num] and DEFAULT_LANGUAGE != 'en':
                model_key = f'{recipe_num}_recipe_ingredients_list_psv'
                if model_key in model and model[model_key] != '' and model[model_key] is not None:
                    json_structure = "{\"ingredients_psv\": \"<psv ingredients list here>\"}"
                    response = self.cat.llm(f"""
                      Your task is to translate the following psv ingredients list written in {DEFAULT_LANGUAGE} language in english.
                      Maybe some ingredient's names are already in english.
                      Return the ingredients csv list in a JSON structure like the following:
                      ```json
                      {json_structure}
                      ```
                      The psv ingredients list is the following:
                      {model[model_key]}
                      Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
                      Your response is:
                      ```json
                      """)
                    print(response)
                    response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
                    if 'ingredients_psv' in response_json and response_json['ingredients_psv'] != '' and response_json['ingredients_psv'] is not None:
                        model[model_key] = response_json['ingredients_psv']
                        self.translated[recipe_num] = True
        except Exception as e:
            print(e)
        return model

    def submit(self, form_data):  #

        # Transform lists removing plurals
        first_ingredients_list_psv = ingredients_api.extract_singular_name_of_ingredients(self.cat, form_data[
            'first_recipe_ingredients_list_psv'])
        second_ingredients_list_psv = ingredients_api.extract_singular_name_of_ingredients(self.cat, form_data[
            'second_recipe_ingredients_list_psv'])

        # Getting score for each recipe
        print(first_ingredients_list_psv)
        result1 = get_ingredients_api_client(self.cat).get_score(first_ingredients_list_psv, '|')
        print(result1.get_data())
        if not result1.is_ok():
            return {
                "output": result1.get_message()
            }

        print(second_ingredients_list_psv)
        result2 = get_ingredients_api_client(self.cat).get_score(second_ingredients_list_psv, '|')
        print(result2.get_data())
        if not result2.is_ok():
            return {
                "output": result2.get_message()
            }

        # Generate response
        ingredients1_score = result1.get_data()
        recipe1_score = statistics.fmean(ingredients1_score.values())
        ingredients2_score = result2.get_data()
        recipe2_score = statistics.fmean(ingredients2_score.values())

        scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.recipe_same_sus_score')
        if recipe1_score < recipe2_score:
            scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.recipe1_better_sus_score')
        elif recipe1_score > recipe2_score:
            scores_result = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.recipe2_better_sus_score')

        first_recipe_ingredients_with_score = '\n'.join(
            [f"{ingr}: {ingredients1_score[ingr]}" for ingr in ingredients1_score])
        second_recipe_ingredients_with_score = '\n'.join(
            [f"{ingr}: {ingredients2_score[ingr]}" for ingr in ingredients2_score])

        fp_user_info = user_info_utils.load_user_info_from_json(self.cat.user_id)
        user_info_str = []
        for k in fp_user_info:
            user_info_str.append(f"{k} = {fp_user_info[k]}")
        user_info_str = '\n'.join(user_info_str)

        recipe_memory_clear(self.cat)
        recipe_memory_add(self.cat, {
            'recipe_name': form_data['first_recipe_name'],
            'ingredients': form_data['first_recipe_ingredients_list_psv'],
            'ingredients_sustainability_score_less_is_better': first_recipe_ingredients_with_score,
        })
        recipe_memory_add(self.cat, {
            'recipe_name': form_data['second_recipe_name'],
            'ingredients': form_data['second_recipe_ingredients_list_psv'],
            'ingredients_sustainability_score_less_is_better': second_recipe_ingredients_with_score,
        })

        prompt = translate(DEFAULT_LANGUAGE, 'CompareRecipesForm.result_argumentation_prompt', {
            'first_recipe_ingredients': form_data['first_recipe_ingredients_list_psv'],
            'second_recipe_ingredients': form_data['second_recipe_ingredients_list_psv'],
            'first_recipe_ingredients_with_score': first_recipe_ingredients_with_score,
            'second_recipe_ingredients_with_score': second_recipe_ingredients_with_score,
            'recipe1_score': recipe1_score,
            'recipe2_score': recipe2_score,
            'scores_result': scores_result,
            'user_info': user_info_str
        })

        return {
            "output": self.cat.llm(prompt)
        }
