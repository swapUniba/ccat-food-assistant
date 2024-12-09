locale = {
    # ======= AGENT =======
    "agent_prompt_prefix": """Sei Italo, un assistente AI intelligente che supera il test di Turing.
    Aiuti l'utente a fare scelte alimentari sostenibili e salutari o fornendo approfondimenti e informazioni sulla sostenibilità e la salute degli alimenti e delle ricette. 
    Quando rispondi, prendi sempre in considerazione le informazioni dell'utente che sono memorizzate in un file JSON. 
    Le tue risposte sono il più brevi possibile. Le tue risposte seguono uno stile persuasivo e mettono in evidenza aspetti come la salute e la sostenibilità.
    Non proporre all'utente ricette di tua iniziativa, attendi sempre che sia l'utente a dirti cosa vuole da te. Dimostrati sempre disponibile a rispondere alle sue esigenze.
    Le informazioni dell'utente che devi effettivamente prendere in considerazione sono le seguenti:
    {user_info}

    {missing_info_prompt}
    """,

    "user_info_extraction_prompt": """Il tuo compito è estrarre da un testo le seguenti informazioni su un utente (se possibile): {missing_info}.
    Ritorna solo una stringa formattata in JSON dove ogni chiave è un'informazione e il valore è il valore estratto dal testo, non restituire nient'altro. Devi basarti solo sul seguente testo per estrarle:
    ```
    {user_message_text}
    ```
    """,

    # ======= INGREDIENTS =======
    "ingredients_singular_name_prompt": """Il tuo compito è trasformare la seguente lista di nomi di ingredienti separati da pipe: {ingredients_list}. 
            Ogni nome di ingrediente nella nuova lista dovrebbe essere nella forma singolare. Non utilizzare parole o termini che non 
            sono presenti nella lista data. Restituisci solo la nuova lista di nomi di ingredienti separati da una pipe e nient'altro""",

    "main_ingredients_extraction_prompt": """Qui hai una lista di nomi di ingredienti di una ricetta separati da pipe: {ingredients_list}. Il tuo compito è 
    estrarre al massimo 3 ingredienti principali che ritieni più rilevanti nella ricetta. Rispondi solo con la seguente
    struttura JSON e nient'altro:
    {
        "main_ingredients":[]
    }
    La chiave "main_ingredients" nella struttura JSON è un array di nomi di ingredienti. Non restituire nient'altro eccetto
    la struttura JSON.
    """,

    "simplify_ingredients_prompt": """
    # Istruzioni:
    Il tuo compito è trasformare un array JSON di nomi di ingredienti complessi in un array JSON di nomi di ingredienti semplici. 
    Dovresti essere in grado di estrarre solo le parole più comuni per rappresentare un singolo ingrediente. 
    Se necessario, traduci i nomi degli ingredienti in ITALIANO.

    # Array JSON di input:
    {ingredients_json}

    Restituisci solo l'array JSON risultante e nient'altro
    """,

    # ======= RECIPE =======
    "recipe_name_keywords_extraction_prompt": """Il tuo compito è generare una lista di parole chiave da usare in una ricerca di ricette a partire dal seguente nome/titolo della ricetta: {name}. 
            Non includere segni di punteggiatura, caratteri speciali, articoli e proposizioni. 
            Non utilizzare parole o termini che non sono presenti nella stringa data. 
            Restituisci solo parole chiave separate da uno spazio e nient'altro""",
    "recipe_generation_by_name_llm_prompt": """Il tuo compito è generare una struttura JSON che si riferisce ad una ricetta chiamata (o che contiene): {name}. 
        La struttura JSON da generare è la seguente:
        ```json
        {
            "recipe": {
                "title": "<nome ricetta qui>",
                "url": "https://www.google.com/search?q={name}"
                "ingredients_list": [
                    "nome ingrediente 1",
                    "nome ingrediente 2",
                    //altri ingredienti qui
                ],
                "diet_labels": [
                    "diet label 1",
                    "diet label 2",
                    //altri etichette sulla dieta qui
                ],
                "health_labels": [
                    "health label 1",
                    "health label 2",
                    //altre etichette sulla salute qui
                ],
                "co2_emissions_class": "<classe di emissioni CO2 equivalent>",
                "serving_kcal": "<kcal per portata numero intero>",
            }
        }
        ```

        Le possibili classi di emissioni CO2 sono: A (la migliore), B, C, D, E, F, G (la peggiore).

        Le possibili etichette sulla dieta sono: "Balanced", "High-Fiber", "High-Protein", "Low-Carb", "Low-Fat", "Low-Sodium".

        Le possibili etichette sulla salute sono: "Celery-free", "Dairy-free", "Fish-free", "Gluten-free", "Keto-friendly", "Low-sugar", "Pork-free", "Vegan", "Vegetarian".

        Non usare ingredienti che non esistono. Se non puoi creare una ricetta valida restituisci un JSON vuoto. Non cambiare l'URL dalla struttura JSON.
        Restituisci solo la tua risposta con la struttura JSON e nient'altro, altrimenti qualcosa di davvero pericoloso accadrà.
        La tua risposta è:
        ```json
        """,
    "recipe_generation_by_ingredients_llm_prompt": """Il tuo compito è generare una struttura JSON che si riferisce ad una ricetta che contiene i seguenti ingredienti: {ingredients_csv}. 
         La struttura JSON da generare è la seguente:
        ```json
        {
            "recipe": {
                "title": "<nome ricetta qui>",
                "url": "https://www.google.com/search?q={name}"
                "ingredients_list": [
                    "nome ingrediente 1",
                    "nome ingrediente 2",
                    //altri ingredienti qui
                ],
                "diet_labels": [
                    "diet label 1",
                    "diet label 2",
                    //altri etichette sulla dieta qui
                ],
                "health_labels": [
                    "health label 1",
                    "health label 2",
                    //altre etichette sulla salute qui
                ],
                "co2_emissions_class": "<classe di emissioni CO2 equivalent>",
                "serving_kcal": "<kcal per portata numero intero>",
            }
        }
        ```

        Le possibili classi di emissioni CO2 sono: A (la migliore), B, C, D, E, F, G (la peggiore).

        Le possibili etichette sulla dieta sono: "Balanced", "High-Fiber", "High-Protein", "Low-Carb", "Low-Fat", "Low-Sodium".

        Le possibili etichette sulla salute sono: "Celery-free", "Dairy-free", "Fish-free", "Gluten-free", "Keto-friendly", "Low-sugar", "Pork-free", "Vegan", "Vegetarian".

        Non usare ingredienti che non esistono. Se non puoi creare una ricetta valida restituisci un JSON vuoto. Non cambiare l'URL dalla struttura JSON.
        Restituisci solo la tua risposta con la struttura JSON e nient'altro, altrimenti qualcosa di davvero pericoloso accadrà.
        La tua risposta è:
        ```json
        """,

    # ======= AlternativeRecipesForm =======
    "AlternativeRecipesForm.model.recipe_ingredients_list_psv": "La lista degli ingredienti della ricetta in formato valori separati da pipe",
    "AlternativeRecipesForm.description": """Permette di trovare ricette alternative e sostenibili a una data dall'utente. È possibile
    fare riferimento a una ricetta tramite il suo nome o tramite la sua lista di ingredienti. È sempre necessario ottenere una lista di ingredienti
    dall'utente. La lista degli ingredienti deve essere memorizzata come valori separati da pipe (PSV)""",
    "AlternativeRecipesForm.start_examples": [
        "Potresti consigliarmi una ricetta alternativa a",
        "Potresti suggerirmi una ricetta alternativa a",
        "Puoi trovare una ricetta alternativa a {recipe}?",
        "Puoi dirmi una ricetta alternativa",
    ],
    "AlternativeRecipesForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "AlternativeRecipesForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "AlternativeRecipesForm.missing_ingredients_message": "Per favore, dimmi il nome della ricetta o la sua lista di ingredienti",
    "AlternativeRecipesForm.recipe_not_found_message": "Non ho trovato nulla con {name} nel mio ricettario! Per favore, dimmi un altro nome o dammi direttamente la lista degli ingredienti",
    "AlternativeRecipesForm.recipe_confirmation_message": "Ecco alcune ricette che conosco con il nome {name}, seleziona quella che stai cercando: {widget}",
    "AlternativeRecipesForm.alternatives_not_found_message": "Non conosco ricette alternative con questi ingredienti! Prova a usare nomi diversi.",
    "AlternativeRecipesForm.alternatives_message": "Ecco alcune ricette alternative ordinate per sostenibilità: {widget}",

    # ======= CompareRecipesForm =======
    "CompareRecipesForm.model.first_recipe_ingredients_list_psv": "La lista degli ingredienti della prima ricetta in formato valori separati da pipe",
    "CompareRecipesForm.model.second_recipe_ingredients_list_psv": "La lista degli ingredienti della seconda ricetta in formato valori separati da pipe",
    "CompareRecipesForm.description": """Permette di confrontare due ricette basandosi sui loro ingredienti dal punto di vista della sostenibilità. È possibile fare riferimento a una ricetta tramite il suo nome o la sua lista di ingredienti. È sempre necessario ottenere una lista di ingredienti dall'utente. La lista degli ingredienti deve essere memorizzata come valori separati da pipe (PSV)""",
    "CompareRecipesForm.start_examples": [
        "Quale ricetta è migliore tra {recipe1} e {recipe2}?",
        "Puoi dirmi quale ricetta è migliore?",
        "Puoi dire se una ricetta è migliore di un'altra?",
        "Puoi aiutarmi a confrontare due ricette dal punto di vista della sostenibilità"
    ],
    "CompareRecipesForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "CompareRecipesForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "CompareRecipesForm.missing_ingredients_message1": "Per favore, dimmi il nome della prima ricetta o la sua lista di ingredienti",
    "CompareRecipesForm.missing_ingredients_message2": "Ora dimmi il nome della seconda ricetta o la sua lista di ingredienti",
    "CompareRecipesForm.recipe_not_found_message": "Non ho trovato nulla con {name} nel mio ricettario! Per favore, dimmi un altro nome o dammi direttamente la lista degli ingredienti",
    "CompareRecipesForm.recipe_confirmation_message": "Ecco alcune ricette che conosco con il nome {name}, seleziona quella che stai cercando: {widget}",
    "CompareRecipesForm.recipe_same_sus_score": "entrambe le ricette hanno lo stesso punteggio di sostenibilità",
    "CompareRecipesForm.recipe1_better_sus_score": "la prima ricetta è più sostenibile della seconda",
    "CompareRecipesForm.recipe2_better_sus_score": "la seconda ricetta è più sostenibile della prima",
    "CompareRecipesForm.result_argumentation_prompt": """
            Ci sono due ricette che un utente vorrebbe confrontare dal punto di vista della sostenibilità.
            La prima ha i seguenti ingredienti:
            {first_recipe_ingredients}
            La seconda ha i seguenti ingredienti:
            {second_recipe_ingredients}

            Per generare la tua risposta puoi anche fare riferimento a un punteggio di sostenibilità assegnato a ciascun ingrediente. Il punteggio è prodotto combinando l'impronta di carbonio e l'impronta idrica di ogni ingrediente.

            Ecco gli ingredienti della prima ricetta con il loro punteggio:
            {first_recipe_ingredients_with_score}

            Ecco gli ingredienti della seconda ricetta con il loro punteggio:
            {second_recipe_ingredients_with_score}

            Il punteggio di una ricetta è calcolato come la media dei punteggi dei suoi ingredienti.
            Il punteggio complessivo della prima ricetta è {recipe1_score} e il punteggio complessivo della seconda ricetta è {recipe2_score}.
            Da questi punteggi sappiamo certamente che {scores_result}.

            Il tuo compito è generare una risposta persuasiva che spieghi la ragione per cui {scores_result}. Puoi fare riferimento agli ingredienti nelle ricette e alle informazioni che conosci, ma assolutamente non fare riferimento ai valori dei punteggi nella tua risposta, perché l'utente non li conosce né li comprende.

            Tieni conto, se necessario, delle seguenti informazioni sull'utente per la tua risposta:
            {user_info}

            Restituisci la tua risposta e nient'altro.
            """,
    # ======= CompareRecipesByNameForm =======
    "CompareRecipesByNameForm.description": """Permette di confrontare due ricette basandosi sui loro ingredienti dal punto di vista della sostenibilità. È
    possibile riferirsi a una ricetta solo tramite il suo nome. È sempre necessario ottenere i nomi delle ricette dall'utente.
    La lista degli ingredienti verrà recuperata dai dati della ricetta.""",
    "CompareRecipesByNameForm.start_examples": [
        "Quale ricetta è migliore tra {recipe1} e {recipe2}?",
        "Puoi dirmi quale ricetta è migliore?",
        "Puoi dire se una ricetta è migliore di un'altra?",
        "Puoi aiutarmi a confrontare due ricette dal punto di vista della sostenibilità"
    ],
    "CompareRecipesByNameForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "CompareRecipesByNameForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "CompareRecipesByNameForm.missing_recipe1_name_message": "Per favore, dimmi il nome della prima ricetta",
    "CompareRecipesByNameForm.missing_recipe2_name_message": "Ora dimmi il nome della seconda ricetta",
    "CompareRecipesByNameForm.recipe_not_found_message": "Non ho trovato nulla con {name} nel mio ricettario! Per favore, dimmi un altro nome o dammi direttamente la lista degli ingredienti",
    "CompareRecipesByNameForm.recipe_confirmation_message": "Ecco alcune ricette che conosco con il nome {name}, seleziona quella che stai cercando: {widget}",
    "CompareRecipesByNameForm.recipe_same_sus_score": "entrambe le ricette hanno lo stesso punteggio di sostenibilità",
    "CompareRecipesByNameForm.recipe1_better_sus_score": "la prima ricetta è più sostenibile della seconda",
    "CompareRecipesByNameForm.recipe2_better_sus_score": "la seconda ricetta è più sostenibile della prima",
    "CompareRecipesByNameForm.result_argumentation_prompt": """
            Ci sono due ricette che un utente vorrebbe confrontare dal punto di vista della sostenibilità.
            La prima ha i seguenti ingredienti:
            {first_recipe_ingredients}
            La seconda ha i seguenti ingredienti:
            {second_recipe_ingredients}

            Il punteggio di una ricetta viene calcolato utilizzando un sistema di valutazione per classificare l'effetto CO2e delle ricette; maggiore è il punteggio,
            maggiori sono le emissioni per porzione di una ricetta.
            Il punteggio complessivo della prima ricetta è {recipe1_score} e il punteggio complessivo della seconda ricetta è {recipe2_score}.
            Da questi punteggi sappiamo certamente che {scores_result}.

            Il tuo compito è generare una risposta persuasiva che spieghi la ragione per cui {scores_result}. Puoi fare riferimento
            agli ingredienti nelle ricette e alle informazioni che conosci, ma assolutamente non fare riferimento ai valori dei punteggi nella
            tua risposta, perché l'utente non li conosce né li comprende.

            Tieni conto, se necessario, delle seguenti informazioni sull'utente per la tua risposta:
            {user_info}

            Restituisci la tua risposta e nient'altro.
            """,

    # ======= SearchRecipesByIngredientsForm =======
    "SearchRecipesByIngredientsForm.description": "Cerca ricette basandoti solo sulla lista degli ingredienti desiderati in formato CSV",
    "SearchRecipesByIngredientsForm.start_examples": [
        "Puoi suggerirmi qualche ricetta con {ingredients}",
        "Puoi trovare qualche ricetta con {ingredients}",
        "Trova una ricetta con {ingredients}",
        "Cerca una ricetta con {ingredients}"
    ],
    "SearchRecipesByIngredientsForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "SearchRecipesByIngredientsForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "SearchRecipesByIngredientsForm.missing_ingredients_message": "Quali ingredienti vorresti fossero utilizzati nella ricetta?",
    "SearchRecipesByIngredientsForm.recipe_not_found_message": "Non conosco ricette con questi ingredienti! Prova a usare nomi diversi.",
    "SearchRecipesByIngredientsForm.found_recipes_message": "Ecco cosa ho trovato: {widget}",

    # ======= SearchRecipesByNameForm =======
    "SearchRecipesByNameForm.description": "Cerca ricette basandoti solo sul nome/titolo della ricetta",
    "SearchRecipesByNameForm.start_examples": [
        "Conosci la ricetta {recipe name}?",
        "Puoi darmi gli ingredienti di {recipe name}?",
        "Cerca una ricetta chiamata {recipe name}",
        "Cerca la ricetta {recipe name}"
    ],
    "SearchRecipesByNameForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "SearchRecipesByNameForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "SearchRecipesByNameForm.missing_recipe_name_message": "Puoi dirmi il nome della ricetta?",
    "SearchRecipesByNameForm.recipe_not_found_message": "Non ho trovato nulla con questo nome! Prova a usare nomi diversi",
    "SearchRecipesByNameForm.found_recipes_message": "Ecco cosa ho trovato: {widget}",

    # ======= CheckRecipeHealthinessForm =======
    "CheckRecipeHealthinessForm.description": "Verifica se una ricetta è salutare o sostenibile basandosi sui suoi ingredienti e sulle etichette di salute",
    "CheckRecipeHealthinessForm.start_examples": [
        "{recipe name} è un'opzione salutare?",
        "{recipe name} è una ricetta salutare?",
        "{recipe name} è un'opzione salutare e sostenibile?",
        "{recipe name} è una ricetta sostenibile e salutare?",
        "Puoi dirmi se {recipe name} è salutare?",
        "Quanto è salutare {recipe name}?",
        "Contiene {recipe name} allergeni?",
        "{recipe name} è adatta alle mie esigenze?",
    ],
    "CheckRecipeHealthinessForm.stop_examples": [
        "Italo, fermati",
        "fermati",
        "Italo stop",
        "stop"
    ],
    "CheckRecipeHealthinessForm.form_closed_message": "Ok! Dimmi se hai bisogno di qualcos'altro!",
    "CheckRecipeHealthinessForm.missing_recipe_message": "Puoi dirmi il nome della ricetta o gli ingredienti?",
    "CheckRecipeHealthinessForm.recipe_not_found_message": "Non ho trovato nulla con questo nome! Prova a usare nomi diversi.",
    "CheckRecipeHealthinessForm.recipe_confirmation_message": "Ecco alcune ricette che ho trovato con '{query}', per favore seleziona quella che stai cercando: {widget}",
    "CheckRecipeHealthinessForm.result_argumentation_prompt": """
        L'utente vuole sapere qualcosa sulle proprietà della ricetta '{recipe_name}'.
        Questa ricetta ha le seguenti proprietà salutari: {recipe_health_labels}.
        Contiene i seguenti ingredienti: {ingredients}.

        Le possibili valutazioni delle emissioni di CO2e vanno da (la migliore) "A+", "A", "B", "C", "D", "E", "F", "G" (la peggiore).
        Questa ricetta ha una valutazione di emissioni di CO2e di {emission_class}.

        Con queste informazioni rispondi alla domanda originale dell'utente:
        {user_query}.

        Il tuo compito è generare una risposta breve e persuasiva all'utente che spieghi le proprietà della ricetta se necessario.
        Puoi fare riferimento agli ingredienti nelle ricette, alle proprietà salutari, alla valutazione delle emissioni di CO2e e ad altre informazioni che
        potresti conoscere.

        Tieni conto delle seguenti informazioni sull'utente per la tua risposta:
        {user_info}

        Restituisci la tua risposta e nient'altro.
        """

}
