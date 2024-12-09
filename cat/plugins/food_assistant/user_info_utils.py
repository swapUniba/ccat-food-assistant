import json

# Default user info structure
import os

default_user_info = {
    "name": None,
    "age": None,
    "gender": None,
    "food allergies": None,
    "favorite ingredients": None,
    "disliked ingredients": None,
    "weight goal": None,
    "diseases": None,
    "dietary restrictions": None
}


def save_user_info_to_json(uid, user_info):
    try:
        with open(f"/userinfo_{uid}.json", 'w') as json_file:
            json.dump(user_info, json_file, indent=4)
    except Exception as e:
        print(f"An error occurred while saving user info to JSON: {e}")


def load_user_info_from_json(uid):
    try:
        with open(f"/userinfo_{uid}.json", 'r') as json_file:
            user_info = json.load(json_file)
        return user_info
    except (FileNotFoundError, json.JSONDecodeError) as e:
        # print(f"An error occurred: {e}")
        return default_user_info
    except Exception as e:
        # print(f"An unexpected error occurred: {e}")
        return default_user_info


def merge_user_info(base_info, new_info_json: str):
    try:
        # Convert JSON string to dictionary
        json_dict = json.loads(new_info_json)

        # Update base dictionary with common fields from JSON dictionary
        for key in json_dict:
            if key in base_info:
                base_info[key] = json_dict[key]

        return base_info
    except json.JSONDecodeError:
        print("Invalid JSON string")
        return base_info
    except Exception as e:
        print(f"An error occurred: {e}")
        return base_info
