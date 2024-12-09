import json

from pydantic import BaseModel, Field

from cat.experimental.form import CatForm, form, CatFormState
from cat.plugins.food_assistant.api import ingredients_api, recipes_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_clear, recipe_memory_add, recipe_memory_get
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget
from cat.plugins.food_assistant.shortlinks import create_shortlink


#################################
# Alternative recipes by name
#################################

class AlternativeRecipesRequest(BaseModel):
    recipe_ingredients_list_psv: str = Field(..., description=translate(DEFAULT_LANGUAGE,
                                                                        'AlternativeRecipesForm.model.recipe_ingredients_list_psv'))
    recipe_name: str
    recipe_confirmed: bool


@form
class AlternativeRecipesForm(CatForm):
    name = "AlternativeRecipesForm"
    description = translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.description')
    model_class = AlternativeRecipesRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.stop_examples')
    ask_confirm = False
    translated = False

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.form_closed_message')
            }

        model = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            # Ask for the recipe info (name or ingredients) if none is available
            if 'recipe_ingredients_list_psv' in missing_fields and 'recipe_name' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.missing_ingredients_message')
                }

            # If recipe info are based on the name we ask confirmation by searchig for it
            if 'recipe_name' in model and not self.is_recipe_confirmed():
                return self.confirm_recipe_by_name_step(model)

        out = f"""
        Current: {model}.
        Missing: {missing_fields}.
        Invalid: {errors}
        """

        return {
            "output": out
        }

    def is_recipe_confirmed(self):
        model = self._model
        return 'recipe_confirmed' in model and model['recipe_confirmed']

    def confirm_recipe_by_name_step(self, model: dict):
        keywords = recipes_api.extract_keywords_from_recipe_name(self.cat, model["recipe_name"])

        response = get_recipes_api_client(self.cat).search_by_name(keywords, 100, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        if len(recipes) == 0:
            name = self._model['recipe_name']
            del self._model['recipe_name']
            return {
                "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.recipe_not_found_message', {'name': name})
            }

        widget_recipes = []
        for i in range(0, min(5, len(recipes))):
            ingredients = [ingr['name'] for ingr in recipes[i]['ingredients_list']]
            widget_recipes.append({
                'index': i,
                'name': recipes[i]['title'],
                'image_url': create_shortlink(recipes[i]['image_url']),
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
            })

        return {
            "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.recipe_confirmation_message', {
                'name': model['recipe_name'],
                'widget': custom_list_group_widget('recipes', widget_recipes, 'index')
            })
        }

    def sanitize(self, model):
        model = super().validate(model)

        try:
            recipes_memory = recipe_memory_get(self.cat)
            if len(recipes_memory) > 0 and not self.is_recipe_confirmed():
                json_structure = '{"index": <integer-index-here>}'
                last_user_message = self.cat.working_memory.history[-1]
                prompt = f"""
                        You have to make a decision and return the index of a recipe that I give to you. 
                        The last user message is: {last_user_message['message'] if last_user_message is not None else ''}
                        You have to choose between one of the following recipes on the basis of the user question or message. If the 
                        user does not reference any of the following recipes, just return the index "-1". If the user in his message
                        refer to a recipe at a specific position return that recipe index.
                        Returns a JSON object in the form 
                        ```json
                        {json_structure}
                        ```
    
                        # Recipe JSON array
                        {json.dumps(recipes_memory)}
    
                        Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
                        Your response is:
                        ```json
                        """
                response = self.cat.llm(prompt)
                response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
                if 'index' in response_json:
                    idx = int(response_json['index'])
                    if 0 <= idx < len(recipes_memory):
                        self.recipes_search_results = recipes_memory
                        model['recipe_ingredients_list_psv'] = '|'.join(recipes_memory[idx]['ingredients'])
                        model['recipe_confirmed'] = True
                        model['recipe_name'] = '-'
        except Exception as e:
            print(e)

        if 'recipe_confirmed' not in model and 'recipe_name' not in model and 'recipe_ingredients_list_psv' in model:
            model['recipe_confirmed'] = True
            model['recipe_name'] = '-'

        try:
            if not self.translated and DEFAULT_LANGUAGE != 'en':
                if 'recipe_ingredients_list_psv' in model and model['recipe_ingredients_list_psv'] != '' and model['recipe_ingredients_list_psv'] is not None:
                    json_structure = "{\"ingredients_psv\": \"<psv ingredients list here>\"}"
                    response = self.cat.llm(f"""
                    Your task is to translate the following psv ingredients list written in {DEFAULT_LANGUAGE} language in english.
                    Maybe some ingredient's names are already in english.
                    Return the ingredients csv list in a JSON structure like the following:
                    ```json
                    {json_structure}
                    ```
                    The psv ingredients list is the following:
                    {model['recipe_ingredients_list_psv']}
                    Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
                    Your response is:
                    ```json
                    """)
                    print(response)
                    response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
                    if 'ingredients_psv' in response_json and response_json['ingredients_psv'] != '' and response_json['ingredients_psv'] is not None:
                        model['recipe_ingredients_list_psv'] = response_json['ingredients_psv']
                        self.translated = True
        except Exception as e:
            print(e)

        return model

    def submit(self, form_data):  #
        main_ingredients = ingredients_api.extract_main_ingredients(self.cat, form_data['recipe_ingredients_list_psv'])
        print(form_data['recipe_ingredients_list_psv'])
        print(main_ingredients)

        response = get_recipes_api_client(self.cat).search_by_ingredients(
            ';'.join([ingr.strip() for ingr in main_ingredients]), 100, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        if len(recipes) == 0:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.alternatives_not_found_message')
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
            "output": translate(DEFAULT_LANGUAGE, 'AlternativeRecipesForm.alternatives_message', {
                'widget': custom_list_group_widget('recipes', widget_recipes, '')
            })
        }
