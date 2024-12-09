# preprocessing.py
import pandas as pd

def remove_duplicate_titles(df):
    """
    Removes recipes with duplicate titles.

    :param df: DataFrame containing the recipes.
    :return: DataFrame with duplicates removed.
    """
    return df.drop_duplicates(subset='title', keep='first')

def remove_recipes_without_tags(df):
    """
    Removes recipes that don't have any tags.

    :param df: DataFrame containing the recipes.
    :return: DataFrame with recipes without tags removed.
    """
    return df[df['tags'].notna() & (df['tags'] != '')]


def invert_sustanability_score(df):
    df['sustainability_score'] = 1 - df['sustainability_score']
    return df
