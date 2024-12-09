import json

from pydantic import BaseModel

from cat.experimental.form import CatForm, form, CatFormState
from cat.plugins.food_assistant import user_info_utils
from cat.plugins.food_assistant.api import recipes_api, ingredients_api
from cat.plugins.food_assistant.api.factory.client_factory import get_recipes_api_client
from cat.plugins.food_assistant.food_assistant import recipe_memory_get
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE
from cat.plugins.food_assistant.message_widgets import custom_list_group_widget
from cat.plugins.food_assistant.shortlinks import create_shortlink


#################################
# Check Recipe Healthiness
#################################

class CheckRecipeHealthinessRequest(BaseModel):
    user_query: str
    recipe_name_or_ingredients: str
    recipe_confirmed: bool
    selected_index: int


@form
class CheckRecipeHealthinessForm(CatForm):
    name = "CheckRecipeHealthinessForm"
    description = translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.description')
    model_class = CheckRecipeHealthinessRequest
    start_examples = translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.start_examples')
    stop_examples = translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.stop_examples')
    ask_confirm = False
    recipes_search_results = []

    def sanitize(self, model):
        model = super().sanitize(model)
        recipes_memory = recipe_memory_get(self.cat)
        if 'user_query' in model and len(recipes_memory) > 0:
            json_structure = '{"index": <integer-index-here>}'
            last_user_message = self.cat.working_memory.history[-1]
            prompt = f"""
            You have to make a decision and return the index of a recipe that I give to you. 
            A user asked the following question about a recipe/food: {model['user_query']}. 
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
                    model['selected_index'] = idx
                    model['recipe_confirmed'] = True
        return model

    def message(self):
        if self._state == CatFormState.CLOSED:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.form_closed_message')
            }

        current_fields = self._model
        missing_fields = self._missing_fields
        errors = self._errors

        if missing_fields:
            if 'recipe_name_or_ingredients' in missing_fields:
                return {
                    "output": translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.missing_recipe_message')
                }

        if 'recipe_name_or_ingredients' in current_fields and not self.is_recipe_confirmed():
            return self.confirm_recipe_by_name(current_fields['recipe_name_or_ingredients'])

        out = f"""
        Current: {current_fields}.
        Missing: {missing_fields}.
        Invalid: {errors}
        """

        return {
            "output": out
        }

    def is_recipe_confirmed(self):
        model = self._model
        return 'recipe_confirmed' in model and model['recipe_confirmed'] and 'selected_index' in model and model[
            'selected_index']

    def confirm_recipe_by_name(self, query):
        # Extract keywords from the user's query
        keywords = recipes_api.extract_keywords_from_recipe_name(self.cat, query)

        # Search for recipes by name or ingredient
        response = get_recipes_api_client(self.cat).search_by_name(keywords, 1, False)
        if not response.is_ok():
            return {
                "output": response.get_message()
            }

        recipes = response.get_data()['data']
        if len(recipes) == 0:
            return {
                "output": translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.recipe_not_found_message')
            }

        # Store search results and ask the user to select one
        widget_recipes = []
        for i in range(0, min(5, len(recipes))):
            ingredients = [ingr['name'] for ingr in recipes[i]['ingredients_list']]
            widget_recipes.append({
                'index': i,
                'name': recipes[i]['title'],
                'score': recipes[i]['score'],
                'health_labels': recipes[i]['health_labels'],
                'image_url': create_shortlink(recipes[i]['image_url']),
                'ingredients': ingredients_api.simplify_ingredient_list(self.cat, ingredients),
            })

        self.recipes_search_results = widget_recipes

        return {
            "output": translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.recipe_confirmation_message', {
                'query': query,
                'widget': custom_list_group_widget('recipes', widget_recipes, 'index')
            })
        }

    def submit(self, form_data):
        # User selected a recipe from the list
        recipe = self.recipes_search_results[form_data['selected_index']]
        health_labels = recipe['health_labels']
        sustainability_score = recipe['score']
        ingredients = ', '.join(recipe['ingredients'])

        fp_user_info = user_info_utils.load_user_info_from_json(self.cat.user_id)
        user_info_str = []
        for k in fp_user_info:
            user_info_str.append(f"{k} = {fp_user_info[k]}")
        user_info_str = '\n'.join(user_info_str)

        # Generate a comprehensive output using the LLM
        prompt = translate(DEFAULT_LANGUAGE, 'CheckRecipeHealthinessForm.result_argumentation_prompt', {
            'recipe_name': recipe['name'],
            'recipe_health_labels': ', '.join(health_labels),
            'ingredients': ingredients,
            'emission_class': ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'][sustainability_score - 1],
            'user_query': form_data['user_query'],
            'user_info': user_info_str
        })

        llm_output = self.cat.llm(prompt)

        return {
            "output": llm_output
        }
