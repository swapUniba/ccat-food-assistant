# nutrition_vectorizer.py
import pandas as pd
from sklearn.preprocessing import StandardScaler

class NutritionVectorizer:
    def __init__(self, nutrients):
        """
        Initializes the NutritionVectorizer with the specified nutrients.

        :param nutrients: List of nutrient names to use.
        """
        self.nutrients = nutrients
        self.scaler = StandardScaler()
        self.nutrient_vectors_df = None

    def fit_transform(self, recipes_df):
        """
        Fits the StandardScaler to the nutrient data and transforms it into a normalized vector space.

        :param recipes_df: DataFrame containing the recipes and their nutrient information.
        :return: DataFrame containing the normalized nutrient vectors with recipe IDs.
        """
        # Extract the nutrient data and fit the scaler
        nutrient_data = recipes_df[self.nutrients]
        normalized_nutrient_data = self.scaler.fit_transform(nutrient_data)

        # Create a DataFrame for the normalized nutrient vectors
        normalized_df = pd.DataFrame(normalized_nutrient_data, columns=self.nutrients, index=recipes_df.index)

        # Combine with recipe_id
        nutrient_vectors_df = pd.concat([recipes_df[['recipe_id']], normalized_df], axis=1)

        return nutrient_vectors_df

    def transform(self, recipes_df):
        """
        Transforms new nutrient data using the already fitted scaler.

        :param recipes_df: DataFrame containing new recipes and their nutrient information.
        :return: DataFrame containing the normalized nutrient vectors.
        """
        nutrient_data = recipes_df[self.nutrients]
        normalized_nutrient_data = self.scaler.transform(nutrient_data)

        # Create a DataFrame for the normalized nutrient vectors
        normalized_df = pd.DataFrame(normalized_nutrient_data, columns=self.nutrients, index=recipes_df.index)

        return normalized_df

