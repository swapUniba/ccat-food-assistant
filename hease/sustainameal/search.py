from sklearn.metrics.pairwise import cosine_similarity
import torch
from scipy.spatial.distance import cdist

def find_similar_by_title(input_text, k, entities_list, embeddings, transformer):
    """
    Finds the most similar recipes to the given input.

    Args:
    input_text (str): The input text for which to calculate the embedding.
    k (int): Number of similar recipes to find.
    entities_list (list of tuples): List of tuples (recipe_id, recipe_title) against which to calculate similarity.
    embeddings (np.array or torch.Tensor): Matrix of embeddings for the entities.
    transformer (RecipeTransformer): Instance of RecipeTransformer for computing embeddings.

    Returns:
    list: List of tuples ((recipe_id, recipe_title), similarity_score) for the 'k' most similar recipes.
    """

    # Use RecipeTransformer to compute the embedding of the input text
    input_embedding = transformer.process_batch([input_text])[0]

    # Ensure that the input embedding and the provided embeddings have the same dimension
    assert input_embedding.shape[0] == embeddings.shape[1], "Embedding dimensions do not match."

    # Convert the embeddings to numpy format if necessary
    if isinstance(input_embedding, torch.Tensor):
        input_embedding = input_embedding.cpu().numpy()
    if isinstance(embeddings, torch.Tensor):
        embeddings = embeddings.cpu().numpy()

    # Calculate cosine similarity between the input embedding and the provided embeddings
    similarities = cosine_similarity([input_embedding], embeddings)[0]

    # Pair each entity (recipe_id, recipe_title) with its similarity and sort by similarity
    similar_entities_with_scores = [((entity[0], entity[1]), similarities[i]) for i, entity in enumerate(entities_list)]
    similar_entities_with_scores.sort(key=lambda x: x[1], reverse=True)

    # Return the top 'k' most similar recipes
    return similar_entities_with_scores[:k]

def find_nearest_recipes_by_tags_and_id(recipe_id, recipes_df, nutrient_vectors_df, tags_to_match, match_all_tags=True, n=10, distance_metric='cosine'):
    """
    Finds the nearest recipes based on a nutritional value vector and tags.

    Args:
    recipe_id (int): Reference recipe ID.
    recipes_df (pd.DataFrame): DataFrame containing recipe data, including tags.
    nutrient_vectors_df (pd.DataFrame): DataFrame of normalized nutritional vectors.
    tags_to_match (list of str): List of tags to match.
    match_all_tags (bool): If True, searches for matches with all tags, otherwise with at least one.
    n (int): Number of similar recipes to find.
    distance_metric (str): Distance metric to use, set by default to 'cosine'.

    Returns:
    list: List of tuples (recipe_id, title, similarity) of the 'n' nearest recipes.
    """

    if recipe_id not in nutrient_vectors_df['recipe_id'].values:
        raise ValueError(f"Recipe ID {recipe_id} not found in DataFrame.")

    # Find the vector of the reference recipe
    recipe_vector = nutrient_vectors_df[nutrient_vectors_df['recipe_id'] == recipe_id].drop('recipe_id', axis=1).values

    # Filter recipes based on tags
    if match_all_tags:
        filtered_df = recipes_df[recipes_df['tags'].apply(lambda tags: all(tag in tags for tag in tags_to_match))]
    else:
        filtered_df = recipes_df[recipes_df['tags'].apply(lambda tags: any(tag in tags for tag in tags_to_match))]

    print(f"Number of filtered recipes: {len(filtered_df)}")

    if filtered_df.empty:
        print("No recipes match the tag filter criteria.")
        return []

    # Find the nutritional vectors corresponding to the filtered recipes
    filtered_nutrient_vectors_df = nutrient_vectors_df[nutrient_vectors_df['recipe_id'].isin(filtered_df['recipe_id'])]
    # Calculate cosine similarity
    similarities = 1 - cdist(recipe_vector, filtered_nutrient_vectors_df.drop('recipe_id', axis=1).values, metric=distance_metric).flatten()

    # Add similarity to the filtered DataFrame
    filtered_df = filtered_df.reset_index(drop=True)

    filtered_df['similarity'] = similarities

    # Sort the filtered recipes by similarity and select the top 'n'
    nearest_recipes_info = filtered_df[filtered_df['recipe_id'] != recipe_id].sort_values(by='similarity',
                                                                                          ascending=False).head(n)

    return nearest_recipes_info[['recipe_id', 'title', 'similarity']].to_records(index=False)

def find_nearest_recipes_by_nutrients_and_tags(nutrient_vector, recipes_df, nutrient_vectors_df, tags_to_match, match_all_tags=True, n=10, distance_metric='cosine'):
    """
    Finds the nearest recipes based on a nutritional value vector and tags.

    Args:
    nutrient_vector (numpy.ndarray): The nutritional vector of the recipe of interest.
    recipes_df (pd.DataFrame): DataFrame containing recipe data, including tags.
    nutrient_vectors_df (pd.DataFrame): DataFrame of normalized nutritional vectors.
    tags_to_match (list of str): List of tags to match.
    match_all_tags (bool): If True, searches for matches with all tags, otherwise with at least one.
    n (int): Number of similar recipes to find.
    distance_metric (str): Distance metric to use, set by default to 'cosine'.

    Returns:
    list: List of tuples (recipe_id, title, similarity) of the 'n' nearest recipes.
    """

    # Ensure that the nutritional vector is in the correct shape (1, number of nutrients)
    if nutrient_vector.ndim == 1:
        nutrient_vector = nutrient_vector.reshape(1, -1)
    # Filter recipes based on tags
    if match_all_tags:
        filtered_df = recipes_df[recipes_df['tags'].apply(lambda tags: all(tag in tags for tag in tags_to_match))]
    else:
        filtered_df = recipes_df[recipes_df['tags'].apply(lambda tags: any(tag in tags for tag in tags_to_match))]

    print(f"Number of filtered recipes: {len(filtered_df)}")

    if filtered_df.empty:
        print("No recipes match the tag filter criteria.")
        return []

    # Find the nutritional vectors corresponding to the filtered recipes
    filtered_nutrient_vectors_df = nutrient_vectors_df[nutrient_vectors_df['recipe_id'].isin(filtered_df['recipe_id'])]

    # Calculate cosine similarity
    similarities = 1 - cdist(nutrient_vector, filtered_nutrient_vectors_df.drop('recipe_id', axis=1).values, metric=distance_metric).flatten()

    # Add similarity to the filtered DataFrame
    filtered_df['similarity'] = similarities
    filtered_df = filtered_df.sort_values(by='similarity', ascending=False)[:n]

    # Return the information of the nearest recipes
    return filtered_df[['recipe_id', 'title', 'similarity']].to_records(index=False)

