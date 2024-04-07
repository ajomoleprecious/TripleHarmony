let amountOfpokemons = document.getElementById('amountOfPokemons');
let listForm = document.getElementById('getAmountOfPokemons');

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
    /*let currentPage = parseInt(localStorage.getItem('page'));
    if (currentPage > 0) {
        listForm.querySelector('input[name="page"]').value = currentPage - 1;
        localStorage.setItem('page', currentPage - 1);
        listForm.submit();
    }*/
    listForm.querySelector('input[name="page"]').value = parseInt(listForm.querySelector('input[name="page"]').value) - 1;
    listForm.submit();
});

nextButton.addEventListener('click', function () {
    /*let currentPage = parseInt(localStorage.getItem('page'));
    listForm.querySelector('input[name="page"]').value = currentPage + 1;
    localStorage.setItem('page', currentPage + 1);
    listForm.submit();*/
    listForm.querySelector('input[name="page"]').value = parseInt(listForm.querySelector('input[name="page"]').value) + 1;
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
            detailType.innerHTML = `<span class="bg-primary">${data.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join('</span> <span class="bg-primary">')}</span>`;
            detailName.innerText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;
        });
    detailImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    // Roep de functie op om de evolutieketen op te halen en weer te geven
    await createPokemonList(id);
}

// Function to fetch evolution chain data based on ID
async function fetchEvolutionChain(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const data = await response.json();
    return data;
}

// Function to create HTML list from evolution chain data
async function createPokemonList(id) {
    const evolutionChain = await fetchEvolutionChain(id);
    const pokemonNames = [];

    // Extract Pokemon names from the evolution chain data
    function extractNames(chain) {
        pokemonNames.push(chain.species.name);
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((evolution) => {
                extractNames(evolution);
            });
        }
    }
    extractNames(evolutionChain.chain);

    // Create HTML list dynamically
    const ul = document.getElementById('evolutionChain');
    ul.innerHTML = '';
    pokemonNames.forEach((name) => {
        ul.innerHTML += `
        <li>
        <a href="#">
          <img src="" alt="${name}">
        </a>
        <p>${name}</p>
        </li>`;
        console.log(name);
    });
}

window.onload = function () {
    // Get the current page number from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 0;
    listForm.querySelector('input[name="page"]').value = currentPage;
    localStorage.setItem('page', currentPage);
}
