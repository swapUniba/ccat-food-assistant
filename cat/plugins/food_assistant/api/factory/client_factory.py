from cat.plugins.food_assistant.api.edamam.ingredients import IngredientsApiClient as EdamamIngredientsApiClient
from cat.plugins.food_assistant.api.edamam.recipes import RecipesApiClient as EdamamRecipesApiClient
from cat.plugins.food_assistant.api.foodprint.ingredients import IngredientsApiClient as FoodPrintIngredientsApiClient
from cat.plugins.food_assistant.api.foodprint.recipes import RecipesApiClient as FoodPrintRecipesApiClient
from cat.plugins.food_assistant.food_assistant import SEARCH_ENGINE_EDAMAM, SEARCH_ENGINE_FOOD_PRINT


def get_ingredients_api_client(cat):
    settings = cat.mad_hatter.get_plugin().load_settings()
    if settings['search_engine'] == SEARCH_ENGINE_FOOD_PRINT:
        return FoodPrintIngredientsApiClient(cat)
    elif settings['search_engine'] == SEARCH_ENGINE_EDAMAM:
        return EdamamIngredientsApiClient(cat)
    else:
        raise ValueError(format)


def get_recipes_api_client(cat):
    settings = cat.mad_hatter.get_plugin().load_settings()
    if settings['search_engine'] == SEARCH_ENGINE_FOOD_PRINT:
        return FoodPrintRecipesApiClient(cat)
    elif settings['search_engine'] == SEARCH_ENGINE_EDAMAM:
        return EdamamRecipesApiClient(cat)
    else:
        raise ValueError(format)