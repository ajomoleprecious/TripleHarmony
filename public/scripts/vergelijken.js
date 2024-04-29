const leftInput = document.querySelector('input[name="left_pokemon"]');
const rightInput = document.querySelector('input[name="right_pokemon"]');
const form = document.getElementById('vergelijkenForm');
function handleKeyPress(event) {
    // Check if the key pressed was Enter
    if (event.keyCode === 13) {
        if(leftInput.value && rightInput.value) {
            form.submit();
        }
        else {
            alert("Gelieve twee pokemons namen in te geven.");
        }
    }
}

function submitForm(event) {
    if(leftInput.value && rightInput.value) {
        form.submit();
    }
    else {
        alert("Gelieve twee pokemons namen in te geven.");
    }
}