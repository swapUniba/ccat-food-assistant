import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from typing import Type, Callable, Any
from pydantic import BaseModel, Field
from langchain.tools import BaseTool

class CurrentRecipeInput(BaseModel):
    """Inputs for AlternativeSustainableRecipeTool"""
    recipe: str = Field(description="Name of the recipe")


class AlternativeSustainableRecipeTool(BaseTool):
    name = "AlternativeSustainableRecipeTool"
    description = """
        Useful when you want to get alternative recipes to a given recipe. This tool return a an alternative recipe.
        """

    args_schema: Type[BaseModel] = CurrentRecipeInput


    get_alternative_recipe: Callable = None

    def __init__(self, **data):
        super().__init__(**data)
        self.get_alternative_recipe = data.get('get_alternative_recipe_func')

    def _run(self, recipe: str):
        recipes_response = self.get_alternative_recipe(recipe)
        return recipes_response

    def _arun(self, recipe: str):
        raise NotImplementedError("AlternativeSustainableRecipeTool does not support async")

class Agent:
    def __init__(self, model_id='meta-llama/Meta-Llama-3.1-8B-Instruct', memory_size=10, temperature=0):
        # Configurazione per l'uso di LLaMA in modalità quantizzata a 4 bit
        nf4_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16
        )

        # Carica il tokenizer e il modello LLaMA
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_id,
            quantization_config=nf4_config,
            device_map="auto",
        )

        self.memory_size = memory_size
        self.temperature = temperature

    def ask(self, question):
        # Converti la domanda in un prompt per LLaMA
        inputs = self.tokenizer.apply_chat_template(question, tokenize=True, add_generation_prompt=True, return_tensors="pt").to("cuda:0")

        # Genera la risposta con il modello LLaMA
        outputs = self.model.generate(inputs, do_sample=True, max_new_tokens=256)
        response = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]

        # Pulisci la risposta per estrarre solo il testo dell'assistente
        response_start = response.find("assistant\n\n") + len("assistant\n\n")
        clean_response = response[response_start:]

        return clean_response