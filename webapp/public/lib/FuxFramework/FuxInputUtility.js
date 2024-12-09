/**
 * @description Permette di visualizzare nello span immediatamente dopo l'input nel DOM il conteggio
 * dei caratteri scritti in un input box.
 * @param inputElement riferimento ad un elemento DOM di tipo <input>
 * @param maxCharacters numero massimo di caratteri inseribili nell'input
 * @param charactersRatioFormat stringa che verrà usata come formato per cambiare il testo dell'elemento che segue l'input.
 * deve contenere la stringa {ratio} in qualsiasi posizione per contenere il rapporto tra caratteri usati e quelli disponibili
 * @param classList un'oggetto strutturato come segue
 * {
 *     0: <string>, //Classe da applicare alla label che segue l'input quando lo 0% dei caratteri massimi è stato raggiunto
 *     25: <string>, //Classe da applicare alla label che segue l'input quando il 25% dei caratteri massimi è stato raggiunto
 *     50: <string>, //Classe da applicare alla label che segue l'input quando il 50% dei caratteri massimi è stato raggiunto
 *     75: <string>, //Classe da applicare alla label che segue l'input quando il 75% dei caratteri massimi è stato raggiunto
 * }
 * @param labelElement Elemendo Dom che conterrà il testo del conteggio caratteru dell'input
 * */
function FuxMaxLength(inputElement, maxCharacters, charactersRatioFormat, classList, labelElement) {
    if (!labelElement) labelElement = inputElement.nextElementSibling;
    inputElement.setAttribute('maxLength', maxCharacters);

    inputElement.onkeyup = function (e) {
        labelElement.innerHTML = charactersRatioFormat.replace('{ratio}', inputElement.value.length + '/' + maxCharacters);
        var ratio = parseInt(inputElement.value.length) / parseInt(maxCharacters) * 100;
        var newClass = '';
        if (ratio >= 0) {
            newClass = classList['0'] || newClass;
        }
        if (ratio >= 25) {
            newClass = classList['25'] || newClass;
        }
        if (ratio >= 50) {
            newClass = classList['50'] || newClass;
        }
        if (ratio >= 75) {
            newClass = classList['75'] || newClass;
        }
        labelElement.className = newClass;
    }

    inputElement.onkeyup();
}
