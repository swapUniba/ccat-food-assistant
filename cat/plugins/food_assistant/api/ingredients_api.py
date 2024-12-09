import json

from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE


def extract_singular_name_of_ingredients(cat, list_psv) -> list[str]:
    return list_psv
    # Obtain the ingredients list with non-plural form of name
    new_list = cat.llm(translate(DEFAULT_LANGUAGE, 'ingredients_singular_name_prompt', {
        'ingredients_list': list_psv
    }))

    if not new_list:
        return list_psv
    return new_list


def extract_main_ingredients(cat, list_psv):
    # Obtain the ingredients list with non-plural form of name
    llm_response = cat.llm(translate(DEFAULT_LANGUAGE, 'main_ingredients_extraction_prompt', {
        'ingredients_list': list_psv,
    }))

    json_response = json.loads(llm_response)
    if 'main_ingredients' in json_response:
        return json_response['main_ingredients']
    return list_psv.split('|')


def simplify_ingredient_list(cat, ingredients: list[str]) -> list[str]:
    # Obtain the ingredients list with non-multiple form of name
    llm_response = cat.llm(translate(DEFAULT_LANGUAGE, 'simplify_ingredients_prompt', {
        'ingredients_json': json.dumps(ingredients),
    }))

    try:
        json_response = json.loads(llm_response)
        if isinstance(json_response, list):
            return json_response
        return ingredients
    except:
        return ingredients
