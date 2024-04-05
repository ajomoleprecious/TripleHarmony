let amountOfpokemons = document.getElementById('amountOfPokemons');
let listForm = document.getElementById('getAmountOfPokemons');
// on DOMContentloaded

// get the value from local storage
if (localStorage.getItem('amountOfPokemons')) {
    amountOfpokemons.value = localStorage.getItem('amountOfPokemons');
}
else {
    amountOfpokemons.value = 50;
}
// on change
amountOfpokemons.addEventListener('change', function () {
    // store the value in local storage
    localStorage.setItem('amountOfPokemons', amountOfpokemons.value);
    listForm.submit();
});


let previousButton = document.getElementById('previous');
let nextButton = document.getElementById('next');

previousButton.addEventListener('click', function () {
    let currentPage = parseInt(listForm.querySelector('input[name="page"]').value);
    if (currentPage > 0) {
        listForm.querySelector('input[name="page"]').value = currentPage - 1;
        localStorage.setItem('page', currentPage - 1);
        listForm.submit();
    }
});

nextButton.addEventListener('click', function () {
    let currentPage = parseInt(listForm.querySelector('input[name="page"]').value);
    listForm.querySelector('input[name="page"]').value = currentPage + 1;
    localStorage.setItem('page', currentPage + 1);
    listForm.submit();
});

let detailImg = document.getElementById("detailImg");
let detailWeight = document.getElementById("detailWeight");
let detailLength = document.getElementById("detailLength");
let detailType = document.getElementById("detailType");
let detailName = document.getElementById("detailName");

async function showDetails(id) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => {
            detailWeight.innerText = `${data.weight}`;
            detailLength.innerText = `${data.height}`;
            detailType.innerText = `${data.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ')}`;
            detailName.innerText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;
        });
    detailImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    // Roep de functie op om de evolutieketen op te halen en weer te geven
    await fetchAndDisplayEvolutionChain(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
}

// Functie om de evolutieketen op te halen en aan te passen in de HTML
async function fetchAndDisplayEvolutionChain(chainURL) {
    try {
        const response = await fetch(chainURL);
        const data = await response.json();

        // De eerste Pokémon in de keten
        const firstPokemon = data.chain.species.name;
        const firstPokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.chain.species.url.split('/')[6]}.png`;

        // Voeg de eerste Pokémon toe aan de HTML
        const evolutionChainElement = document.getElementById('evolutionChain');

        evolutionChainElement.innerHTML = '';

        evolutionChainElement.innerHTML += `
        <li>
          <a href="#">
            <img src="${firstPokemonImage}" alt="${firstPokemon}">
          </a>
          <p>${firstPokemon}</p>
        </li>
      `;
            
    } catch (error) {
        console.error('Er is een fout opgetreden bij het ophalen en weergeven van de evolutieketen:', error);
    }
}




if (localStorage.getItem('page')) {
    listForm.querySelector('input[name="page"]').value = localStorage.getItem('page');
}

window.onload = function () {
    localStorage.setItem('page', 0);
}
