import json
from enum import Enum

from pydantic import BaseModel

from cat.mad_hatter.decorators import tool, hook, plugin
from cat.plugins.food_assistant import user_info_utils
from cat.log import log
from cat.plugins.food_assistant.locales.locales import translate, DEFAULT_LANGUAGE


#####################
# Agent configuration
#####################


@hook
def before_cat_reads_message(user_message_json, cat):
    fp_user_info = user_info_utils.load_user_info_from_json(cat.user_id)
    # Updating user info with fields obtained from websocket
    if user_message_json['prompt_settings']['user'] is not None:
        usr = user_message_json['prompt_settings']['user']
        fp_user_info["name"] = f"{usr['first_name']} {usr['last_name']}"

    missing_info = [key for key in fp_user_info if fp_user_info[key] is None]
    if len(missing_info) > 0:
        extraction_prompt = translate(DEFAULT_LANGUAGE, 'user_info_extraction_prompt', {
            'missing_info': json.dumps(missing_info),
            'user_message_text': user_message_json["text"]
        })
        extraction = cat.llm(extraction_prompt)
        fp_user_info = user_info_utils.merge_user_info(fp_user_info, extraction)
        log.critical(fp_user_info)
        user_info_utils.save_user_info_to_json(cat.user_id, fp_user_info)
    return user_message_json


@hook
def before_cat_sends_message(message, cat):
    # Adding plugin settings configuration to the input key in the "why" object of the response
    message.why.input = json.dumps({
        'text': message.why.input,
        'assistant_settings': cat.mad_hatter.get_plugin().load_settings(),
        'active_form': cat.working_memory.active_form.name if cat.working_memory.active_form is not None else ''
    })
    return message


@hook
def agent_prompt_prefix(prefix, cat):
    fp_user_info = user_info_utils.load_user_info_from_json(cat.user_id)
    print(json.dumps(fp_user_info))
    user_info_str = []
    for k in fp_user_info:
        user_info_str.append(f"{k} = {fp_user_info[k]}")
    user_info_str = '\n'.join(user_info_str)

    missing_info = [key for key in fp_user_info if fp_user_info[key] is None]
    missing_info_prompt = ''
    if missing_info:
        missing_info_prompt = f"""Do not ask the user's name if they already provided it. If possible, ask to the user about their {missing_info[0]}.\n"""

    prefix = translate(DEFAULT_LANGUAGE, 'agent_prompt_prefix', {
        'user_info': user_info_str,
        'missing_info_prompt': missing_info_prompt
    })

    return prefix


@hook  # default priority = 1
def before_cat_recalls_procedural_memories(procedural_recall_config, cat):
    # decrease the threshold to recall more tools
    procedural_recall_config["threshold"] = 0.4
    return procedural_recall_config


@hook  # default priority = 1
def before_cat_recalls_episodic_memories(episodic_recall_config, cat):
    episodic_recall_config["k"] = 5
    episodic_recall_config["threshold"] = 0.5
    # episodic_recall_config["metadata"]["source"] = 0
    return episodic_recall_config


@hook  # default priority = 1
def agent_allowed_tools(allowed_tools, cat):
    filtered_allowed_tools = {t for t in allowed_tools if check_tool_enabled(cat, t)}
    return filtered_allowed_tools


def recipe_memory_add(cat, recipe):
    print(">> MEMORY ADD")
    print(recipe)
    if cat.working_memory.recipes_memory is None:
        cat.working_memory.recipes_memory = []
    cat.working_memory.recipes_memory.append(recipe)


def recipe_memory_get(cat):
    print(">> MEMORY GET")
    if cat.working_memory.recipes_memory is None:
        cat.working_memory.recipes_memory = []
    return cat.working_memory.recipes_memory


def recipe_memory_clear(cat):
    print(">> MEMORY CLEAR")
    cat.working_memory.recipes_memory = []


#####################
# Settings
#####################

SEARCH_ENGINE_FOOD_PRINT = "FoodPrint"
SEARCH_ENGINE_EDAMAM = "Edamam"


class SearchEngineSelect(Enum):
    food_print: str = SEARCH_ENGINE_FOOD_PRINT
    edamam: str = SEARCH_ENGINE_EDAMAM


class FoodAssistantSettings(BaseModel):
    food_print_base_url: str
    edamam_base_url: str
    edamam_username: str
    edamam_app_id: str
    edamam_app_key: str
    search_engine: SearchEngineSelect = SearchEngineSelect.food_print
    alternative_recipes_tool: bool = True
    compare_recipes_tool: bool = True
    search_recipes_by_ingredients_tool: bool = True
    search_recipes_by_name_tool: bool = True
    check_recipe_healthiness_tool: bool = True
    use_HeAse_library_for_alternative_recommendations: bool = False


@plugin
def settings_model():
    return FoodAssistantSettings


def check_tool_enabled(cat, tool):
    """
    Check weather a tool is enabled or not based on plugin settings
    :param tool:
    :return: bool
    """
    tools_settings_mapping = {
        "AlternativeRecipesForm": "alternative_recipes_tool",
        "CompareRecipesForm": "compare_recipes_tool",
        "CompareRecipesByNameForm": "compare_recipes_tool",
        "SearchRecipesByIngredientsForm": "search_recipes_by_ingredients_tool",
        "SearchRecipesByNameForm": "search_recipes_by_name_tool",
        "CheckRecipeHealthinessForm": "check_recipe_healthiness_tool",
    }
    tools_enabled_search_engines = {
        "AlternativeRecipesForm": [SEARCH_ENGINE_FOOD_PRINT, SEARCH_ENGINE_EDAMAM],
        "CompareRecipesForm": [SEARCH_ENGINE_FOOD_PRINT],  # Only foodprint
        "CompareRecipesByNameForm": [SEARCH_ENGINE_EDAMAM],  # Only edamam
        "SearchRecipesByIngredientsForm": [SEARCH_ENGINE_FOOD_PRINT, SEARCH_ENGINE_EDAMAM],
        "SearchRecipesByNameForm": [SEARCH_ENGINE_FOOD_PRINT, SEARCH_ENGINE_EDAMAM],
        "CheckRecipeHealthinessForm": [SEARCH_ENGINE_EDAMAM],
    }

    # Check if the tool has to be checked, if not it's valid
    setting_name = tools_settings_mapping[tool] if tool in tools_settings_mapping else None
    if setting_name is None:
        return True

    settings = cat.mad_hatter.get_plugin().load_settings()

    # Check if the search engine is compatible with the tool
    valid_search_engines = tools_enabled_search_engines[tool] if tool in tools_enabled_search_engines else []
    if settings['search_engine'] not in valid_search_engines:
        print(f"{settings['search_engine']} is not in {valid_search_engines}")
        return False

    return settings[setting_name]  # Return True if tool is enabled in the settings
