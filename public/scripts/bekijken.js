let amountOfpokemons = document.getElementById('amountOfPokemons');
let listForm = document.getElementById('getAmountOfPokemons');
let body = document.querySelector('body');
/*
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
*/  // CODE TO CHANGE THE AMOUNT OF POKEMONS TO SHOW ON THE PAGE LOAD (NOT WORKING YET)

let previousButton = document.getElementById('previous');
let nextButton = document.getElementById('next');

previousButton.addEventListener('click', function() {
    listForm.submit();
    
});
nextButton.addEventListener('click', function() {
    
    listForm.submit();
    
});