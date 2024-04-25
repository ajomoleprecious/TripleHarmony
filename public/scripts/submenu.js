window.onload = function () {
    let modal = new bootstrap.Modal(document.getElementById('receive-poke'), {
        keyboard: false,
        backdrop: 'static'
    });
    modal.show();
}