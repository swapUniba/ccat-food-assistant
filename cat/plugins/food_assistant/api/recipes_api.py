import json

from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE

EMISSION_CLASSES = {
    "A+": 1, "A": 2, "B": 3, "C": 4, "D": 5, "E": 6, "F": 7, "G": 8
}


def extract_keywords_from_recipe_name(cat, name):
    # Obtain search keywords from the user given name
    keywords = cat.llm(translate(DEFAULT_LANGUAGE, 'recipe_name_keywords_extraction_prompt', {
        'name': name
    }))

    if not keywords:
        return name
    return keywords


def create_recipe_with_llm_by_name(cat, name):
    response = cat.llm(translate('en', 'recipe_generation_by_name_llm_prompt', {
        'name': name
    }))

    response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
    if 'recipe' in response_json and response_json['recipe']['title'] is not None:
        co2emissionsClass = response_json['recipe']['co2emissions'] if 'co2emissions' in response_json else 'G'
        co2emissionInt = EMISSION_CLASSES[co2emissionsClass] if co2emissionsClass in EMISSION_CLASSES else 9999
        r = response_json['recipe']
        return {
            "title": r['title'],
            "url": r['url'],
            "uri": r['url'],
            "image_url": "",
            "ingredients_list": [{'name': ingr, 'score': 0} for ingr in r['ingredients_list']] if r['ingredients_list'] is not None else [],
            "diet_labels": [label for label in r['diet_labels']] if r['diet_labels'] is not None else [],
            "health_labels": [label for label in r['health_labels']] if r['health_labels'] is not None else [],
            "co2_emissions_class": co2emissionsClass,
            "total_co2_emissions": "unknown",
            "score": co2emissionInt,
            "serving_kcal": r['serving_kcal'] if r['serving_kcal'] is not None else None,
        }
    return None


def create_recipe_with_llm_by_ingredients(cat, ingredients_csv):
    response = cat.llm(translate('en', 'recipe_generation_by_ingredients_llm_prompt', {
        'ingredients_csv': ingredients_csv
    }))

    response_json = json.loads(response.replace("```json", '').replace("```", '').strip())
    if 'recipe' in response_json and response_json['recipe']['title'] is not None:
        co2emissionsClass = response_json['recipe']['co2emissions'] if 'co2emissions' in response_json else 'G'
        co2emissionInt = EMISSION_CLASSES[co2emissionsClass] if co2emissionsClass in EMISSION_CLASSES else 9999
        r = response_json['recipe']
        return {
            "title": r['title'],
            "url": r['url'],
            "uri": r['url'],
            "image_url": "",
            "ingredients_list": [{'name': ingr, 'score': 0} for ingr in r['ingredients_list']] if r['ingredients_list'] is not None else [],
            "diet_labels": [label for label in r['diet_labels']] if r['diet_labels'] is not None else [],
            "health_labels": [label for label in r['health_labels']] if r['health_labels'] is not None else [],
            "co2_emissions_class": co2emissionsClass,
            "total_co2_emissions": "unknown",
            "score": co2emissionInt,
            "serving_kcal": r['serving_kcal'] if r['serving_kcal'] is not None else None,
        }
    return None
