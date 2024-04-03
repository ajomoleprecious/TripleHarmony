let amountOfpokemons = document.getElementById('amountOfPokemons');
let listForm = document.getElementById('getAmountOfPokemons');

// on DOMContentloaded
document.addEventListener('DOMContentLoaded', function() {
    // get the value from local storage
    if (localStorage.getItem('amountOfPokemons')) {
        amountOfpokemons.value = localStorage.getItem('amountOfPokemons');
    }
    else {
        amountOfpokemons.value = 50;
    }
    // on change
    amountOfpokemons.addEventListener('change', function() {
        // store the value in local storage
        localStorage.setItem('amountOfPokemons', amountOfpokemons.value);
        listForm.submit();
    });
});
