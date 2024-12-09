(function () {
    $('.timepicker').on('focus', function (e) {
        if (e.target.disabled) return;
        FuxSwalTimePicker.fire(e.target);
    });
})();


const FuxSwalTimePicker = {
    fire: (element, cb) => {
        var picker = null;
        element.blur() //Rimuovo il focus dall'elemento
        swal({
            title: 'Seleziona un orario',
            html: '_',
            confirmButtonText: 'Conferma',
            showCancelButton: true,
            cancelButtonText: 'Annulla',
            reverseButtons: true,
            allowOutsideClick: false,
            onOpen: function () {
                picker = new Picker(document.getElementById('swal2-content'), {
                    date: element.value || '09:00',
                    format: 'HH:mm',
                    inline: true,
                    controls: true,
                    headers: true,
                    rows: 3,
                    increment: {
                        minute: 5,
                        hour: 1
                    },
                    text: {
                        hour: 'Ora',
                        minute: 'Minuto'
                    }
                });
            }
        }).then(function (result) {
            if (!result.dismiss) {
                element.value = picker.getDate('HH:mm');
                if (cb) cb(picker.getDate('HH:mm'));
            }
            picker.destroy();
        });
    }
}
