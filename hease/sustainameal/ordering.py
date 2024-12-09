import numpy as np
import ast
import pandas as pd


def sort_recipes_by_healthiness_score(nearest_recipes, recipes_df, score_field, input_recipe_heal_score):
    """
    Sorts recipes based on a specified score field.

    Args:
    nearest_recipes_df (pd.DataFrame): DataFrame containing the nearest recipes.
    recipes_df (pd.DataFrame): DataFrame containing the original recipes with score fields.
    score_field (str): The field name of the score to sort by (e.g., 'who_score').
    input_recipe_heal_score (float): who_score of the input recipe

    Returns:
    pd.DataFrame: A DataFrame of the sorted nearest recipes, including their titles and scores.
    """
    len(nearest_recipes)
    # Check if nearest_recipes_df is not empty
    if len(nearest_recipes) > 0:
        # Check if nearest_recipes_df has more than one element
        if len(nearest_recipes) > 1:
            # Extract recipe IDs and similarity scores for multiple elements
            recipe_ids, recipe_scores = zip(*[(recipe.recipe_id, recipe.similarity) for recipe in nearest_recipes])
        else:
            # Handle the case of a single element
            single_recipe = nearest_recipes[0]
            recipe_ids = [single_recipe.recipe_id]
            recipe_scores = [single_recipe.similarity]

        # Create a dictionary mapping recipe IDs to their similarity scores
        recipe_scores_dict = dict(zip(recipe_ids, recipe_scores))

        # Filter the main DataFrame to include only the nearest recipes
        filtered_recipes_df = recipes_df[recipes_df['recipe_id'].isin(recipe_ids)]

        # Add a column of similarity scores to the filtered DataFrame
        filtered_recipes_df['similarity_score'] = filtered_recipes_df['recipe_id'].map(recipe_scores_dict)

        # Sort the filtered DataFrame based on the score field
        sorted_recipes_df = filtered_recipes_df.sort_values(by=score_field, ascending=False)

        # Calculate the healthiness increment
        sorted_recipes_df['healthiness_increment'] = ((sorted_recipes_df[
                                                           'who_score'] - input_recipe_heal_score) / input_recipe_heal_score) * 100

        # Select only relevant columns and the top 10 recipes
        top_sorted_recipes = sorted_recipes_df[
            ['title', 'similarity_score', score_field, 'healthiness_increment']].head(10)

    else:
        # Print a message and return an empty DataFrame if no similar recipes are found
        print("No healthier alternative found.")
        top_sorted_recipes = pd.DataFrame()

    # Return the sorted and filtered DataFrame
    return top_sorted_recipes


def sort_recipes_by_sustainability_score(nearest_recipes, recipes_df, score_field, secondary_sort_field,
                                         input_recipe_sus_score):
    """
    Sorts recipes based on a specified score field with a secondary field.

    Args:
    nearest_recipes_df (pd.DataFrame): DataFrame containing the nearest recipes.
    recipes_df (pd.DataFrame): DataFrame containing the original recipes with score fields.
    score_field (str): The field name of the score to sort by (e.g., 'sustainability_label','sustainability_score').
    secondary_sort_field (str): The field name of the secondary score to sort by
    input_recipe_heal_score (float): sustainability_score of the input recipe

    Returns:
    pd.DataFrame: A DataFrame of the sorted nearest recipes, including their titles and scores.
    """

    # Check if nearest_recipes_df is not empty
    if len(nearest_recipes) > 0:
        # Check if nearest_recipes_df has more than one element
        if len(nearest_recipes) > 1:
            # Extract recipe IDs and similarity scores for multiple elements
            recipe_ids, recipe_scores = zip(*[(recipe.recipe_id, recipe.similarity) for recipe in nearest_recipes])
        else:
            # Handle the case of a single element
            single_recipe = nearest_recipes[0]
            recipe_ids = [single_recipe.recipe_id]
            recipe_scores = [single_recipe.similarity]

        # Create a dictionary mapping recipe IDs to their similarity scores
        recipe_scores_dict = dict(zip(recipe_ids, recipe_scores))

        # Filter the main DataFrame to include only the nearest recipes
        filtered_recipes_df = recipes_df[recipes_df['recipe_id'].isin(recipe_ids)]

        # Add a column of similarity scores to the filtered DataFrame
        filtered_recipes_df['similarity_score'] = filtered_recipes_df['recipe_id'].map(recipe_scores_dict)

        # Sort the filtered DataFrame based on the score field, and then by the secondary_sort_field
        sorted_recipes_df = filtered_recipes_df.sort_values(by=[score_field, secondary_sort_field],
                                                            ascending=[False, False])

        # Calculate the sustainability increment
        sorted_recipes_df['sustainability_increment'] = ((filtered_recipes_df[
                                                              'sustainability_score'] - input_recipe_sus_score) / input_recipe_sus_score) * 100

        # Select only relevant columns and the top recipes
        top_sorted_recipes = sorted_recipes_df[
            ['title', 'similarity_score', score_field, secondary_sort_field, 'sustainability_increment']]

    else:
        # Print a message and return an empty DataFrame if no similar recipes are found
        print("No sustainable alternative found.")
        top_sorted_recipes = pd.DataFrame()

    # Return the sorted and filtered DataFrame
    return top_sorted_recipes


def sort_recipes_by_sustainameal_score(nearest_recipes, recipes_df, input_recipe_sus_score, input_recipe_heal_score,
                                       alpha, beta):
    """
    Sorts recipes based on a specified score field with a secondary field.

    Args:
    nearest_recipes_df (pd.DataFrame): DataFrame containing the nearest recipes.
    recipes_df (pd.DataFrame): DataFrame containing the original recipes with score fields.
    score_field (str): The field name of the score to sort by (e.g., 'sustainability_label','sustainability_score').
    secondary_sort_field (str): The field name of the secondary score to sort by
    input_recipe_heal_score (float): sustainability_score of the input recipe

    Returns:
    pd.DataFrame: A DataFrame of the sorted nearest recipes, including their titles and scores.
    """

    # Check if nearest_recipes_df is not empty
    if len(nearest_recipes) > 0:
        # Check if nearest_recipes_df has more than one element
        if len(nearest_recipes) > 1:
            # Extract recipe IDs and similarity scores for multiple elements
            recipe_ids, recipe_scores = zip(*[(recipe.recipe_id, recipe.similarity) for recipe in nearest_recipes])
        else:
            # Handle the case of a single element
            single_recipe = nearest_recipes[0]
            recipe_ids = [single_recipe.recipe_id]
            recipe_scores = [single_recipe.similarity]

        # Create a dictionary mapping recipe IDs to their similarity scores
        recipe_scores_dict = dict(zip(recipe_ids, recipe_scores))

        # Filter the main DataFrame to include only the nearest recipes
        filtered_recipes_df = recipes_df[recipes_df['recipe_id'].isin(recipe_ids)]

        # Add a column of similarity scores to the filtered DataFrame
        filtered_recipes_df['similarity_score'] = filtered_recipes_df['recipe_id'].map(recipe_scores_dict)

        # Calculate additional scores
        filtered_recipes_df['sustainameal_score'] = filtered_recipes_df.apply(
            lambda row: calculate_sustainameal_score(row['sustainability_score'], row['who_score'], alpha, beta),
            axis=1)

        # Sort the filtered DataFrame based on the 'sustainameal_score'
        sorted_recipes_df = filtered_recipes_df.sort_values(by=['sustainameal_score'], ascending=[False])

        # Calculate increments
        sorted_recipes_df['sustainability_increment'] = ((sorted_recipes_df[
                                                              'sustainability_score'] - input_recipe_sus_score) / input_recipe_sus_score) * 100
        sorted_recipes_df['healthiness_increment'] = ((sorted_recipes_df[
                                                           'who_score'] - input_recipe_heal_score) / input_recipe_heal_score) * 100

        input_recipe_sustainameal_score = calculate_sustainameal_score(input_recipe_sus_score, input_recipe_heal_score,
                                                                       alpha, beta)
        sorted_recipes_df['sustainameal_score_increment'] = ((sorted_recipes_df[
                                                                  'sustainameal_score'] - input_recipe_sustainameal_score) / input_recipe_sustainameal_score) * 100

        # Select only relevant columns and the top recipes
        top_sorted_recipes = sorted_recipes_df[
            ['title', 'similarity_score', 'who_score', 'healthiness_increment', 'sustainability_score',
             'sustainability_increment', 'sustainameal_score', 'sustainameal_score_increment']]

    else:
        # Print a message and return an empty DataFrame if no similar recipes are found
        print("No alternative found.")
        top_sorted_recipes = pd.DataFrame()

    # Return the sorted and filtered DataFrame
    return top_sorted_recipes


def calculate_sustainameal_score(sustainability_score, who_score, alpha, beta):
    sustainameal_score = sustainability_score * alpha + who_score * beta
    return sustainameal_score
