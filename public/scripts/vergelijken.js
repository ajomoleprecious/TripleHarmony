const leftInput = document.querySelector('input[name="left_pokemon"]'),
    rightInput = document.querySelector('input[name="right_pokemon"]'),
    form = document.getElementById("vergelijkenForm");

// Function to handle Enter key press
function handleKeyPress(e) {
    if (e.keyCode === 13) { // Check if Enter key is pressed
        if (leftInput.value && rightInput.value) {
            form.submit(); // Submit the form if both inputs have values
        } else {
            alert("Gelieve twee pokemons namen in te geven."); // Show alert if inputs are empty
        }
    }
}

// Function to submit form on button click
function submitForm(e) {
    if (leftInput.value && rightInput.value) {
        form.submit(); // Submit the form if both inputs have values
    } else {
        alert("Gelieve twee pokemons namen in te geven."); // Show alert if inputs are empty
    }
}

// Function to fetch all Pokemon names from PokeAPI
async function fetchAllPokemons() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    let data = await response.json();
    return data.results;
}

// Function to sort Pokemon names alphabetically
function sortArray(pokemonArray) {
    return pokemonArray.map(pokemon => pokemon.name).sort();
}

let pokemonArray = [], // Array to store all Pokemon names
    sortedPokemonNames = []; // Array to store sorted Pokemon names

// Main function to initialize sortedPokemonNames with sorted Pokemon names
async function main() {
    sortedPokemonNames = sortArray(pokemonArray = await fetchAllPokemons());
}

main(); // Initialize the sortedPokemonNames array

let leftList = document.getElementsByClassName("left-pokemon-list")[0],
    rightList = document.getElementsByClassName("right-pokemon-list")[0],
    count = 0,
    countR = 0;

// Event listener for keyup on leftInput
leftInput.addEventListener("keyup", e => {
    removeElements(leftList); // Remove existing list items
    count = 0; // Reset count
    for (let pokemonName of sortedPokemonNames) {
        if (pokemonName.toLowerCase().startsWith(leftInput.value.toLowerCase()) && leftInput.value !== "") {
            if (count >= 3) break;
            let li = document.createElement("li");
            li.classList.add("list-items");
            li.style.cursor = "pointer";
            li.addEventListener("click", function() {
                displayNames(leftInput, pokemonName, leftList);
            });
            let innerHTML = `<b>${pokemonName.substr(0, leftInput.value.length)}</b>`;
            innerHTML += pokemonName.substr(leftInput.value.length);
            li.innerHTML = innerHTML;
            leftList.appendChild(li);
            count++;
        }
    }
});

// Event listener for keyup on rightInput
rightInput.addEventListener("keyup", e => {
    removeElements(rightList); // Remove existing list items
    countR = 0; // Reset countR
    for (let pokemonName of sortedPokemonNames) {
        if (pokemonName.toLowerCase().startsWith(rightInput.value.toLowerCase()) && rightInput.value !== "") {
            if (countR >= 3) break;
            let li = document.createElement("li");
            li.classList.add("list-items");
            li.style.cursor = "pointer";
            li.addEventListener("click", function() {
                displayNames(rightInput, pokemonName, rightList);
            });
            let innerHTML = `<b>${pokemonName.substr(0, rightInput.value.length)}</b>`;
            innerHTML += pokemonName.substr(rightInput.value.length);
            li.innerHTML = innerHTML;
            rightList.appendChild(li);
            countR++;
        }
    }
});

// Function to display selected Pokemon name in input field and remove list items
function displayNames(inputElement, pokemonName, listElement) {
    inputElement.value = pokemonName;
    removeElements(listElement);
}

// Function to remove all child elements with class 'list-items' from a given element
function removeElements(element) {
    element.querySelectorAll(".list-items").forEach(item => {
        item.remove();
    });
}
