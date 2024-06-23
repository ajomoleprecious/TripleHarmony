// Function to fetch and display details of a specific Pokémon
async function getPokemon(pokemonId) {
    // Get references to the DOM elements
    let pokemonsLabel = document.getElementById("pokemonsLabel"),
        pokemonDetailImg = document.getElementById("pokemondetailImg"),
        pokemonSetLink = document.getElementById("pokemonSetLink"),
        pokemonName = document.getElementById("pokemonName");

    // Fetch Pokémon data from the API
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemonData = await response.json();

    // Update the UI with the fetched Pokémon details
    pokemonsLabel.innerText = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    pokemonDetailImg.src = pokemonData.sprites.other["official-artwork"].front_default;
    pokemonName.innerText = pokemonData.name;

    // Add an event listener to the set link to update the current Pokémon
    pokemonSetLink.addEventListener("click", async () => {
        await fetch(`./changeCurrentPokemon/${pokemonId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                location.reload();  // Reload the page if the request was successful
            }
        });
    });
}

// Get reference to the Pokémon search input element
const pokemonSearch = document.getElementById("pokemonSearch");

// Function to fetch all Pokémon names from the API
async function fetchAllPokemons() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    let data = await response.json();
    return data.results;  // Return the list of Pokémon names
}

// Function to sort an array of Pokémon names
function sortArray(pokemonArray) {
    return pokemonArray.map(pokemon => pokemon.name).sort();
}

// Variables to store the array of Pokémon and the sorted list of names
let pokemonArray = [],
    sortedPokemonNames = [];

// Main function to fetch and sort all Pokémon names
async function main() {
    pokemonArray = await fetchAllPokemons();
    sortedPokemonNames = sortArray(pokemonArray);
}

// Call the main function to initialize the data
main();

// Get reference to the left list container
let leftList = document.getElementsByClassName("left-pokemon-list")[0];
let count = 0;

// Event listener for the Pokémon search input
pokemonSearch.addEventListener("keyup", event => {
    // Remove existing list items and reset count
    removeElements(leftList);
    count = 0;

    // Iterate over the sorted Pokémon names
    for (let name of sortedPokemonNames) {
        // Check if the name starts with the search input value (case-insensitive)
        if (name.toLowerCase().startsWith(pokemonSearch.value.toLowerCase()) && pokemonSearch.value !== "") {
            if (count >= 3) break;  // Limit to 3 suggestions

            // Create a new list item
            let listItem = document.createElement("li");
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";

            // Add a click event listener to display the selected name
            listItem.addEventListener("click", function() {
                displayNames(pokemonSearch, name, leftList);
            });

            // Highlight the matching part of the name
            let highlightedName = `<b>${name.substr(0, pokemonSearch.value.length)}</b>`;
            highlightedName += name.substr(pokemonSearch.value.length);

            // Set the inner HTML of the list item and append it to the left list
            listItem.innerHTML = highlightedName;
            leftList.appendChild(listItem);

            count++;
        }
    }
});

// Function to remove all child elements with class "list-items" from a parent element
function removeElements(parentElement) {
    parentElement.querySelectorAll(".list-items").forEach(item => {
        item.remove();
    });
}

// Function to display the selected Pokémon name in the search input and clear the list
function displayNames(searchInput, name, parentElement) {
    searchInput.value = name;  // Set the input value to the selected name
    removeElements(parentElement);  // Remove all list items
}
