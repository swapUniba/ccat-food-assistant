from fastapi import FastAPI, Query
from typing import List, Optional
import pandas as pd
from sustainameal import SustainaMeal

app = FastAPI()

# Load your data and initialize SustainaMeal when the app starts
recipes_df = pd.read_csv("data/final_recipes_set.csv")
sustainameal = SustainaMeal(
    recipes_df[:1000],
    ['calories [cal]', 'totalFat [g]', 'saturatedFat [g]', 'cholesterol [mg]', 'sodium [mg]', 'dietaryFiber [g]',
     'sugars [g]', 'protein [g]'],
    True,
    'davanstrien/autotrain-recipes-2451975973'
)

# Default acceptable tags
DEFAULT_ACCEPTABLE_TAGS = [
    'appetizers', 'main-dish', 'side-dishes', 'drinks', 'beverages',
    'fruits', 'desserts', 'breakfast', 'pasta-rice-and-grains', 'rice',
    'pasta', 'pizza', 'breads', 'meat', 'fish', 'seafood', 'beef',
    'chicken', 'vegetarian'
]

@app.get("/find-similar-recipes")
def find_similar_recipes(
        recipe_name: str,
        n_similar: int = 10,
):
    # Find similar recipes
    sustainameal.find_similar_recipes(
        recipe_name,
        n_similar,
        acceptable_tags=['appetizers', 'main-dish', 'side-dishes', 'drinks', 'beverages', 'fruits', 'desserts',
                         'breakfast', 'pasta-rice-and-grains', 'rice', 'pasta', 'pizza', 'breads', 'meat', 'fish',
                         'seafood', 'beef', 'chicken', 'vegetarian'],
        match_all_tags=False,
        check_sustainability=False
    )

    # Order recipes by sustainability
    ordered_recipes_sus = sustainameal.order_recipe_by_sustainability()

    # Convert the DataFrame to a list of dictionaries for JSON response
    result = ordered_recipes_sus.to_dict(orient='records')
    return result
