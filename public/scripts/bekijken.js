let amountOfpokemons = document.getElementById('amountOfPokemons');
let listForm = document.getElementById('getAmountOfPokemons');
// Mapping of Pokemon types to colors
const typeColors = {
    normal: "var(--normal)",
    fire: "var(--fire)",
    water: "var(--water)",
    electric: "var(--electric)",
    grass: "var(--grass)",
    ice: "var(--ice)",
    fighting: "var(--fighting)",
    poison: "var(--poison)",
    ground: "var(--ground)",
    flying: "var(--flying)",
    psychic: "var(--psychic)",
    bug: "var(--bug)",
    rock: "var(--rock)",
    ghost: "var(--ghost)",
    dragon: "var(--dragon)",
    dark: "var(--dark)",
    steel: "var(--steel)",
    fairy: "var(--fairy)"
};

// check if amountOfPokemons exist
if (amountOfpokemons === null) {
}
else {
    // get the value from local storage
    if (localStorage.getItem('amountOfPokemons')) {
        amountOfpokemons.value = localStorage.getItem('amountOfPokemons');
    }
    else {
        amountOfpokemons.value = 10;
    }
    // on change
    amountOfpokemons.addEventListener('change', function () {
        // store the value in local storage
        localStorage.setItem('amountOfPokemons', amountOfpokemons.value);
        listForm.submit();
    });
}


let previousButton = document.getElementById('previous');
let nextButton = document.getElementById('next');

previousButton.addEventListener('click', function () {
    let currentPage = parseInt(localStorage.getItem('page'));
    if (currentPage > 0) {
        listForm.querySelector('input[name="page"]').value = currentPage - 1;
        localStorage.setItem('page', currentPage - 1);
        listForm.submit();
    }

});

nextButton.addEventListener('click', function () {
    let currentPage = parseInt(localStorage.getItem('page'));
    listForm.querySelector('input[name="page"]').value = currentPage + 1;
    localStorage.setItem('page', currentPage + 1);
    listForm.submit();
});

let detailImg = document.getElementById("detailImg");
let detailWeight = document.getElementById("detailWeight");
let detailLength = document.getElementById("detailLength");
let detailType = document.getElementById("detailType");
let detailName = document.getElementById("detailName");
let detailbox = document.getElementById('detailbox');
const moreDetails = document.getElementById("moreDetails");

async function DetailOfPokemon(name) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {
            detailWeight.innerHTML = `${data.weight / 10}<sub> kg</sub>`;
            detailLength.innerHTML = `${data.height / 10}<sub> m</sub>`;
            // Mapping types to colored spans
            const typeSpans = data.types.map(type => `<span style="background-color: ${typeColors[type.type.name]}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>`);
            detailType.innerHTML = typeSpans.join(' ');
            detailName.innerText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;
            moreDetails.href = `https://bulbapedia.bulbagarden.net/wiki/${data.name}`;
            detailImg.src = data.sprites.other['official-artwork'].front_default;
        });
}

async function showDetails(pokemonId) {


    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(data => {
            detailWeight.innerHTML = `${data.weight / 10}<sub> kg</sub>`;
            detailLength.innerHTML = `${data.height / 10}<sub> m</sub>`;
            // Mapping types to colored spans
            const typeSpans = data.types.map(type => `<span style="background-color: ${typeColors[type.type.name]}">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</span>`);
            detailType.innerHTML = typeSpans.join(' ');
            detailName.innerText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;
            moreDetails.href = `https://bulbapedia.bulbagarden.net/wiki/${data.name}`;
            detailImg.src = data.sprites.other['official-artwork'].front_default;
        });
    // Get the evolution chain ID from the URL
    let evolutionId;
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        .then(response => response.json())
        .then(data => {
            evolutionId = data.evolution_chain.url.toString().split('/')[6];
        });

    await createPokemonList(evolutionId);
}


// Function to fetch evolution chain data based on ID
async function fetchEvolutionChain(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const data = await response.json();
    return data;
}

// Function to create HTML list from evolution chain data
async function createPokemonList(id) {
    let evolutionChain = await fetchEvolutionChain(id);
    const pokemonNames = [];
    const ul = document.getElementById('evolutionChain');
    ul.innerHTML = '';

    // Extract Pokemon names from the evolution chain data
    if (Array.isArray(evolutionChain.chain.evolves_to) && evolutionChain.chain.evolves_to.length > 0) {
        // Include the initial species (shieldon) in the list of Pokémon names
        pokemonNames.push(evolutionChain.chain.species.name);

        let currentChain = evolutionChain.chain.evolves_to;

        while (currentChain.length > 0) {
            await Promise.all(currentChain.map(async (evolution) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${evolution.species.url.split('/')[6]}`);
                const data = await response.json();
                pokemonNames.push(data.varieties[0].pokemon.name);
                return data;
            }));

            // Update currentChain for the next iteration
            currentChain = currentChain.reduce((acc, val) => acc.concat(val.evolves_to), []);
        }
    }
    else {
        await fetch(`https://pokeapi.co/api/v2/pokemon-species/${evolutionChain.chain.species.url.split('/')[6]}`)
            .then(response => response.json())
            .then(data => {
                pokemonNames.push(data.varieties[0].pokemon.name);
            });
    }


    // Array to store all fetch promises
    const fetchPromises = pokemonNames.map(async (name) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();

        return { name, data };
    });
    // Wait for all fetch requests to resolve
    const pokemonDataList = await Promise.all(fetchPromises);

    // Process the results in order
    pokemonDataList.forEach(({ name, data }) => {
        const li = document.createElement('li');
        li.onclick = () => DetailOfPokemon(name);
        li.innerHTML = `
            <img src="${data.sprites.other['showdown'].front_default || data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
            <p>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
        `;
        ul.appendChild(li);
    });
}


window.onload = function () {
    // Get the current page number from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 0;
    if (amountOfpokemons !== null) {
        listForm.querySelector('input[name="page"]').value = currentPage;
    }
    localStorage.setItem('page', currentPage);
}
