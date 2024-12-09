<?php
?>

<style>
    body {
        background-color: #f8f9fa;
    }

    .form-signup {
        max-width: 400px;
        padding: 15px;
        margin: auto;
        margin-top: 50px;
    }

    .form-signup .form-control {
        margin-bottom: 1rem;
    }
</style>


<div class="container py-5">
    <p class="lead">
        Ciao, ti diamo il benvenut@ in questo esperimento!<br/>
        Per prima cosa vogliamo ringraziarti per aver accettato di provare questo assistente virtuale, il tuo contributo
        sarà essenziale per comprendere al meglio come realizzare assistenti digitali che portino un valore aggiunto
        nella nostra società!
    </p>
    <p class="lead">
        Prima di iniziare ti chiedo di compilare il questionario per le informazioni anagrafiche e di preparazione che
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeGz8T5yfss2i9gzH2rH2NpQSnWAEuhO7xKwBA2yAhM7pwT5A/viewform" target="_blank">trovi qui</a>.
    </p>
    <p class="lead">
        Stai per entrare in contatto con <b><i>Italo</i></b> un assistente dotato di intelligenza artificiale il cui
        compito è
        essere un supporto nelle tue scelte alimentari, con particolare attenzione al tema della sostenibilità e
        all'impatto ambientale delle ricette che prepariamo.
    </p>
    <p class="lead">
        Inizialmente Italo cercherà di conoscere qualcosa su di te, in modo da migliorare i suoi suggerimenti in base
        alle tue esigenze. Ti verranno chieste informazioni come l'età, il genere, ingredienti preferiti o non graditi,
        intolleranze o restrizioni alimentari, ecc...
    </p>
    <p class="lead">
        Italo è in grado di trovare delle ricette a partire dagli ingredienti o dal loro nome, può confrontare due
        ricette e dirti qual è la più sostenibile (a basso impatto ambientale). Puoi anche chiedere se una ricetta che
        ha trovato è sostenibile, se è salutare o se è adatta a te! Infine puoi chiedergli di suggerirti delle ricette
        alternative che contengono alcuni ingredienti che vorresti, ottimo se vuoi scoprire delle ricette più
        sostenibili o se vuoi trovare nuove idee in base a quello che hai in frigo!
    </p>
    <p class="lead">
        Ai fini della riuscita dell'esperimento è necessario che tu faccia compiere a Italo almeno una volta TUTTE le seguenti
        azioni:<br/>
        - <b>Trovare una ricetta</b> in base al nome o lista di ingredienti<br/>
        - Fare <b>domande su una ricetta</b> trovata (ad es. "X è una ricetta sostenibile?" oppure "Y è una ricetta salutare?"
        oppure "Z è una ricetta adatta a me?")<br/>
        - <b>Trovare una ricetta sostenibile alternativa</b> rispetto a una già cercata o che indicherai tu<br/>
        - <b>Confrontare due ricette</b> dal punto di vista della sostenibilità
    </p>
    <p class="lead">
        Non appena sei pront@, compila i campi qui sotto e clicca su Avvia esperimento.
    </p>
</div>

<main class="form-signup text-center">
    <form id="register-form">
        <div class="form-floating">
            <input type="text" class="form-control" name="first_name" placeholder="Nome" required>
            <label for="firstname">Nome (anche non reale)</label>
        </div>

        <div class="form-floating">
            <input type="text" class="form-control" name="username" placeholder="Username" required>
            <label for="username">Username</label>
        </div>

        <button class="w-100 btn btn-lg btn-success" type="submit">Avvia esperimento</button>
    </form>
</main>

<script>
    (function () {
        document.querySelector('#register-form').addEventListener('submit', handleRegister);

        function handleRegister(e) {
            e.preventDefault();
            FuxSwalUtility.loading('Accesso in corso...');
            FuxHTTP.post('<?= routeFullUrl('/experiment') ?>', {
                username: e.target.querySelector('[name="username"]').value,
                first_name: e.target.querySelector('[name="first_name"]').value,
            }, FuxHTTP.RESOLVE_RESPONSE, FuxHTTP.REJECT_MESSAGE)
                .then(r => {
                    window.location.href = r.data;
                })
                .catch(m => {
                    console.log(m);
                    FuxSwalUtility.error(m);
                });
        }

    })();
</script>
