locale = {
    # ======= AGENT =======
    "agent_prompt_prefix": """You are Italo an intelligent AI assistant that passes the Turing test.
    You help the user in making sustainable and healthy food choices or giving insights and information about
    sustainability and healthiness of food and recies. When answering always take into account the user's
    information which are stored in a JSON file. Your responses are as short as possible. Your answers follow a
    persuasive style and highlight aspects like healthiness and sustainability.
    Do not propose recipes to the user on your own initiative, always wait for the user to tell you what he wants from you. Always show yourself available to respond to his needs.
    The user info you actually have to take into account are the following:
    {user_info}
    
    {missing_info_prompt}
    """,

    "user_info_extraction_prompt": """Your task is to extract from a text the following information about a user (if possibile): {missing_info}.
    Return only a JSON formatted string where each key is an information and the value is the extracted value from the
    text, do not return anything else. You must rely only on the following text in order to extract them:
    ```
    {user_message_text}
    ```
    """,

    # ======= INGREDIENTS =======
    "ingredients_singular_name_prompt": """Your task is to transform the following list of pipe separated ingredients name: {ingredients_list}. 
            Each ingredient name in the new list should be in singular form. Do not use words or terms that are not 
            present in the given list. Return only the new list of ingredients name separated by a pipe and nothing more""",

    "main_ingredients_extraction_prompt": """Here you have a list of pipe separated ingredients name of a recipe: {ingredients_list}. Your task is 
    to extract at maximum 3 main ingredients that you consider more relevant in the recipe. Answer with the following
    JSON structure only and nothing more:
    {
        "main_ingredients":[]
    }
    The key "main_ingredients" in the JSON structure is an array of ingredients name. Do not returns anything else except
    the JSON structure.
    """,

    "simplify_ingredients_prompt": """
    # Instructions:
    Your task is to transform a JSON array of complex ingredients name into a JSON array of simple ingredients name. You
    should be able to extract only the most common words to represent a single ingredient.
    If needed, translate ingredients name in ENGLISH.
    
    # Input JSON array:
    {ingredients_json}
    
    Returns only the resulting JSON array and nothing more
    """,

    # ======= RECIPE =======
    "recipe_name_keywords_extraction_prompt": """your task is to generate a list of keywords to use in a recipe search starting from the following recipe name/title: {name}. 
            Do not include punctuation marks, special characters, articles and clauses. 
            Do not use words or terms that are not present in the given string. 
            Return only keywords separated by a space and nothing more""",
    "recipe_generation_by_name_llm_prompt": """Your task is to generate a recipe JSON structure that refer to a recipe called {name}. 
            The JSON structure to generate is the following one:
            ```json
            {
                "recipe": {
                    "title": "<recipe name here>",
                    "url": "https://www.google.com/search?q={name}"
                    "ingredients_list": [
                        "ingredient 1 name",
                        "ingredient 2 name",
                        //other ingredients here
                    ],
                    "diet_labels": [
                        "diet label 1",
                        "diet label 2",
                        //other diets here
                    ],
                    "health_labels": [
                        "health label 1",
                        "health label 2",
                        //other health labels here
                    ],
                    "co2_emissions_class": "<CO2 equivalent emission class here>",
                    "serving_kcal": "<per serving kcal integer value>",
                }
            }
            ```
            
            Possible CO2 emissione classes are: A (the best), B, C, D, E, F, G (the worst).
            
            Possible diet labels are: "Balanced", "High-Fiber", "High-Protein", "Low-Carb", "Low-Fat", "Low-Sodium".
            
            Possible health labels are: "Celery-free", "Dairy-free", "Fish-free", "Gluten-free", "Keto-friendly", "Low-sugar", "Pork-free", "Vegan", "Vegetarian".
            
            Do not use ingredients that does not exists. If you cannot create a valid recipe return an empty JSON structure. Do not change the recipe URL from the JSON structure.
            Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
            Your response is:
            ```json
            """,
    "recipe_generation_by_ingredients_llm_prompt": """Your task is to generate a recipe JSON structure that refer to a recipe that contains following ingredients: {ingredients_csv}. 
            The JSON structure to generate is the following one:
            ```json
            {
                "recipe": {
                    "title": "<recipe name here>",
                    "url": "https://www.google.com/search?q=recipe+with+{ingredients_csv}"
                    "ingredients_list": [
                        "ingredient 1 name",
                        "ingredient 2 name",
                        //other ingredients here
                    ],
                    "diet_labels": [
                        "diet label 1",
                        "diet label 2",
                        //other diets here
                    ],
                    "health_labels": [
                        "health label 1",
                        "health label 2",
                        //other health labels here
                    ],
                    "co2_emissions_class": "<CO2 equivalent emission class here>",
                    "serving_kcal": "<per serving kcal integer value>",
                }
            }
            ```
            
            Possible CO2 emissione classes are: A (the best), B, C, D, E, F, G (the worst).
            
            Possible diet labels are: "Balanced", "High-Fiber", "High-Protein", "Low-Carb", "Low-Fat", "Low-Sodium".
            
            Possible health labels are: "Celery-free", "Dairy-free", "Fish-free", "Gluten-free", "Keto-friendly", "Low-sugar", "Pork-free", "Vegan", "Vegetarian".
            
            Do not use ingredients that does not exists. If you cannot create a valid recipe return an empty JSON structure. Do not change the recipe URL from the JSON structure.
            Return only your response with JSON structure and nothing more, otherwise very dangerous things can happen.
            Your response is:
            ```json
            """,

    # ======= AlternativeRecipesForm =======
    "AlternativeRecipesForm.model.recipe_ingredients_list_psv": "The list of ingredients of the recipe in pipe separated values",
    "AlternativeRecipesForm.description": """Allow to find alternative and sustainable recipes to one given from the user. It is possible to
    reference to a recipe by it's name or by it's ingredients list. It's always needed to obtain a list of ingredients
    from the user. The ingredients list have to be stored as pipe separated values (PSV)""",
    "AlternativeRecipesForm.start_examples": [
        "Could you recommend me an alternative recipe with respect to",
        "Can you find an alternative recipe to {recipe}?",
        "Can you tell me an alternative recipe",
    ],
    "AlternativeRecipesForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "AlternativeRecipesForm.form_closed_message": "Okay! Tell me if you need something else!",
    "AlternativeRecipesForm.missing_ingredients_message": "Please tell me the recipe name or it's ingredients list",
    "AlternativeRecipesForm.recipe_not_found_message": "I didn't find anything with {name} in my cook book! Please tell me another name of give me directly the list of ingredients",
    "AlternativeRecipesForm.recipe_confirmation_message": "Here you have some recipe I know with name {name}, select the one you are looking for: {widget}",
    "AlternativeRecipesForm.alternatives_not_found_message": "I don't know alternative recipes with these ingredients! Try to use different names.",
    "AlternativeRecipesForm.alternatives_message": "Here you have some alternative recipes sorted by sustainability: {widget}",

    # ======= CompareRecipesForm =======
    "CompareRecipesForm.model.first_recipe_ingredients_list_psv": "The list of ingredients of the first recipe in pipe separated values",
    "CompareRecipesForm.model.second_recipe_ingredients_list_psv": "The list of ingredients of the second recipe in pipe separated values",
    "CompareRecipesForm.description": """Allow to compare two recipes based on their ingredients from a sustainability point of view. It is
     possible to reference to a recipe by it's name or by it's ingredients list. It's always needed to obtain a list
     of ingredients from the user. The ingredients list have to be stored as pipe separated values (PSV)""",
    "CompareRecipesForm.start_examples": [
        "Which recipe is better between {recipe1} and {recipe2}?",
        "Can you tell me which recipe is better?",
        "Can you say if a recipe is better than another?",
        "Can you help me compare two recipe from a sustainability point of view"
    ],
    "CompareRecipesForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "CompareRecipesForm.form_closed_message": "Okay! Tell me if you need something else!",
    "CompareRecipesForm.missing_ingredients_message1": "Please tell me the first recipe name or it's ingredients list",
    "CompareRecipesForm.missing_ingredients_message2": "Now tell me the second recipe name or it's ingredients list",
    "CompareRecipesForm.recipe_not_found_message": """I didn't find anything with {name} in my cook book! Please tell me another name of give me directly the list of ingredients""",
    "CompareRecipesForm.recipe_confirmation_message": "Here you have some recipe I know with name {name}, select the one you are looking for: {widget}",
    "CompareRecipesForm.recipe_same_sus_score": "both recipes have the same sustainability score",
    "CompareRecipesForm.recipe1_better_sus_score": "the first recipe is more sustainable than the second one",
    "CompareRecipesForm.recipe2_better_sus_score": "the second recipe is more sustainable than the first one",
    "CompareRecipesForm.result_argumentation_prompt": """
            The are two recipes that a user would like to compare from a sustainability point of view.
            The first one has the following ingredients:
            {first_recipe_ingredients}
            The second one has the following ingredients:
            {second_recipe_ingredients}

            To generate your answer you can also refer to a sustainability score assigned to each ingredient. The score
            is produced by combining the carbon foot print and the water foot print of each ingredient.

            Here you have the ingredients of first recipe with their score:
            {first_recipe_ingredients_with_score}

            Here you have the ingredients of second recipe with their score:
            {second_recipe_ingredients_with_score}

            A recipe score is computed as the mean of the score of its ingredients.
            The overall score of the first recipe is {recipe1_score} and the overall score of the second recipe is {recipe2_score}.
            From these scores we certainly know that {scores_result}.

            Your task is to generate a persuasive answer that explains the reason why {scores_result}. You can refers
            to ingredients in the recipes and information you know, but absolutely not refers to the score values in
            your answer, because the user does not know and understand them.

            Take into account, if needed, the following user information for you answer:
            {user_info}

            Return your answer and nothing more.
            """,
    # ======= CompareRecipesByNameForm =======
    "CompareRecipesByNameForm.description": """Allows comparing two recipes based on their ingredients from a sustainability point of view. It is
    possible to refer to a recipe only by its name. It is always necessary to obtain the recipe names from the user.
    The list of ingredients will be retrieved from the recipe data.""",
    "CompareRecipesByNameForm.start_examples": [
        "Which recipe is better between",
        "Can you tell me which recipe is better",
        "Can you say if a recipe is better than another",
        "Can you help me compare two recipe from a sustainability point of view"
    ],
    "CompareRecipesByNameForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "CompareRecipesByNameForm.form_closed_message": "Okay! Tell me if you need something else!",
    "CompareRecipesByNameForm.missing_recipe1_name_message": "Please tell me the first recipe name",
    "CompareRecipesByNameForm.missing_recipe2_name_message": "Now tell me the second recipe name",
    "CompareRecipesByNameForm.recipe_not_found_message": "I didn't find anything with {name} in my cook book! Please tell me another name or give me directly the list of ingredients",
    "CompareRecipesByNameForm.recipe_confirmation_message": "Here you have some recipe I know with name {name}, select the one you are looking for: {widget}",
    "CompareRecipesByNameForm.recipe_same_sus_score": "both recipes have the same sustainability score",
    "CompareRecipesByNameForm.recipe1_better_sus_score": "the first recipe is more sustainable than the second one",
    "CompareRecipesByNameForm.recipe2_better_sus_score": "the second recipe is more sustainable than the first one",
    "CompareRecipesByNameForm.result_argumentation_prompt": """
            There are two recipes that a user would like to compare from a sustainability point of view.
            The first one has the following ingredients:
            {first_recipe_ingredients}
            The second one has the following ingredients:
            {second_recipe_ingredients}

            A recipe score is computed using a rating system to classify the CO2e effect of recipes, grater the score
            higher is emissions per serving for a recipe.
            The overall score of the first recipe is {recipe1_score} and the overall score of the second recipe is {recipe2_score}.
            From these scores we certainly know that {scores_result}.

            Your task is to generate a persuasive answer that explains the reason why {scores_result}. You can refers
            to ingredients in the recipes and information you know, but absolutely not refers to the score values in
            your answer, because the user does not know and understand them.

            Take into account, if needed, the following user information for you answer:
            {user_info}

            Return your answer and nothing more.
            """,

    # ======= SearchRecipesByIngredientsForm =======
    "SearchRecipesByIngredientsForm.description": "Search recipes based only on the list of the wanted ingredients as CSV",
    "SearchRecipesByIngredientsForm.start_examples": [
        "Can you suggest me some recipe with {ingredients}",
        "Find a recipe with {ingredients}",
        "Search for a recipe with {ingredients}"
    ],
    "SearchRecipesByIngredientsForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "SearchRecipesByIngredientsForm.form_closed_message": "Okay! Tell me if you need something else!",
    "SearchRecipesByIngredientsForm.missing_ingredients_message": "Which ingredients you would like to be used in the recipe?",
    "SearchRecipesByIngredientsForm.recipe_not_found_message": "I don't know recipes with these ingredients! Try to use different names.",
    "SearchRecipesByIngredientsForm.found_recipes_message": "This is what I've found: {widget}",

    # ======= SearchRecipesByNameForm =======
    "SearchRecipesByNameForm.description": "Search recipes based only on the recipe name/title",
    "SearchRecipesByNameForm.start_examples": [
        "You know the recipe {recipe name}?",
        "Can you give me the ingredients of {recipe name}?",
        "Search for a recipe named {recipe name}"
        "Search the recipe {recipe name}"
    ],
    "SearchRecipesByNameForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "SearchRecipesByNameForm.form_closed_message": "Okay! Tell me if you need something else!",
    "SearchRecipesByNameForm.missing_recipe_name_message": "Can you tell me the name of the recipe?",
    "SearchRecipesByNameForm.recipe_not_found_message": "I didn't find anything with this name! Try to use different names",
    "SearchRecipesByNameForm.found_recipes_message": "This is what I've found: {widget}",

    # ======= CheckRecipeHealthinessForm =======
    "CheckRecipeHealthinessForm.description": "Check if a recipe is healthy or sustainable based on its ingredients and health labels",
    "CheckRecipeHealthinessForm.start_examples": [
        "Is {recipe name} a healthy option?",
        "Is {recipe name} a healthy recipe?",
        "Is {recipe name} a healthy and sustainable option?",
        "is {recipe name} a sustainable and healthy recipe?"
        "Can you tell me if {recipe name} is healthy?",
        "How healthy is {recipe name}?",
        "Does {recipe name} contain any allergens?",
        "Is {recipe name} suitable for my needs?",
    ],
    "CheckRecipeHealthinessForm.stop_examples": [
        "Italo stop",
        "stop"
    ],
    "CheckRecipeHealthinessForm.form_closed_message": "Okay! Tell me if you need something else!",
    "CheckRecipeHealthinessForm.missing_recipe_message": "Can you tell me the name of the recipe or the ingredients?",
    "CheckRecipeHealthinessForm.recipe_not_found_message": "I didn't find anything with this name! Try to use different names.",
    "CheckRecipeHealthinessForm.recipe_confirmation_message": "Here you have some recipes I found with '{query}', please select the one you are looking for: {widget}",
    "CheckRecipeHealthinessForm.result_argumentation_prompt": """
        The user wants to know something about the properties of the recipe '{recipe_name}'.
        This recipe has the following health properties: {recipe_health_labels}.
        It contains the following ingredients: {ingredients}.

        Possible CO2e emission ratings are from (the best) "A+", "A", "B", "C", "D", "E", "F", "G" (the worst).
        This recipe has a CO2e emission rating of {emission_class}.

        With those information answer to the original question of the user:
        {user_query}.

        Your task is to generate a short and persuasive answer to the user that explains the recipe properties if needed.
        You can refers to ingredients in the recipes, health properties, CO2e emission rating and other information you
        may know.

        Take into account the following user information for you answer:
        {user_info}

        Return your answer and nothing more.
        """

}
