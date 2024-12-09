# transformer_embeddings.py
from transformers import AutoTokenizer, AutoModel
import torch
from tqdm import tqdm
import numpy as np

class RecipeTransformer:
    def __init__(self, transformer_name='davanstrien/autotrain-recipes-2451975973'):
        """
        Initializes the transformer model and tokenizer.

        :param transformer_name: Name of the transformer model to use for embeddings.
        """
        self.tokenizer = AutoTokenizer.from_pretrained(transformer_name)
        self.model = AutoModel.from_pretrained(transformer_name)

        # Check for GPU availability and move the model to GPU if available
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        torch.cuda.empty_cache()  # Clear cache if needed

    def process_batch(self, texts_batch):
        """
        Processes a batch of texts to produce embeddings using the transformer model.

        :param texts_batch: A batch of text to process.
        :return: Embeddings of the input texts.
        """
        # Aggiungi la barra di progresso di tqdm attorno all'iterazione
        embeddings = []
        for text in tqdm(texts_batch, desc="Processing Titles embeddings", unit="batch"):
            # Tokenizza il testo e prepara il batch per il modello
            batch = self.tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")
            batch = {k: v.to(self.device) for k, v in batch.items()}
            with torch.no_grad():
                # Assicurati che il modello sia sullo stesso dispositivo
                self.model.to(self.device)
                outputs = self.model(**batch)
            # Estrai l'embedding e aggiungilo alla lista
            embeddings.append(outputs.last_hidden_state[:, 0, :].cpu().numpy())

        # Unisci tutti gli embeddings in un'unica matrice NumPy
        return np.vstack(embeddings)

