window.onload = function () {
    const modal = new bootstrap.Modal(document.getElementById('error'), {
        keyboard: false,
        backdrop: 'static'
    });
    modal.show();
}