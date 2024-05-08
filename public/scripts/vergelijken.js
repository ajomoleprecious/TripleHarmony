const leftInput = document.querySelector('input[name="left_pokemon"]');
const rightInput = document.querySelector('input[name="right_pokemon"]');
const form = document.getElementById('vergelijkenForm');
function handleKeyPress(event) {
    // Check if the key pressed was Enter
    if (event.keyCode === 13) {
        if (leftInput.value && rightInput.value) {
            form.submit();
        }
        else {
            alert("Gelieve twee pokemons namen in te geven.");
        }
    }
}

function submitForm(event) {
    if (leftInput.value && rightInput.value) {
        form.submit();
    }
    else {
        alert("Gelieve twee pokemons namen in te geven.");
    }
}

async function fetchAllPokemons() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`);
    const data = await response.json();
    return data.results;
}

function sortArray(pokemonArray) {
    return pokemonArray.map(pokemon => pokemon.name).sort();
}

let pokemonArray = [];
let sortedPokemonNames = [];

async function test() {
    pokemonArray = await fetchAllPokemons();
    sortedPokemonNames = sortArray(pokemonArray);
    console.log(sortedPokemonNames[10]); // or any other index you want
}

test();

///////////////// lists
let leftList = document.getElementsByClassName("left-pokemon-list")[0];
let rightList = document.getElementsByClassName("right-pokemon-list")[0];

///////////////// left
let count = 0;

leftInput.addEventListener('keyup', (e) => {
    removeElements(leftList);
    count = 0; // Reset count on each keyup
    for (let i of sortedPokemonNames) {
        if (i.toLowerCase().startsWith(leftInput.value.toLowerCase()) && leftInput.value !== "") {
            if (count >= 3) {
                break; // Exit loop if count reaches 3
            }
            let listItem = document.createElement('li');
            listItem.classList.add('list-items');
            listItem.style.cursor = 'pointer';
            listItem.addEventListener("click", function () {
                displayNames(leftInput, i, leftList);
            });
            let word = `<b>${i.substr(0, leftInput.value.length)}</b>`;
            word += i.substr(leftInput.value.length);
            listItem.innerHTML = word;
            leftList.appendChild(listItem);
            count++; // Increment count
        }
    }
});

/////////////////// right
let countR = 0;

rightInput.addEventListener('keyup', (e) => {
    removeElements(rightList);
    countR = 0; // Reset count on each keyup
    for (let i of sortedPokemonNames) {
        if (i.toLowerCase().startsWith(rightInput.value.toLowerCase()) && rightInput.value !== "") {
            if (countR >= 3) {
                break; // Exit loop if count reaches 3
            }
            let listItem = document.createElement('li');
            listItem.classList.add('list-items');
            listItem.style.cursor = 'pointer';
            listItem.addEventListener("click", function () {
                displayNames(rightInput, i, rightList);
            });
            let word = `<b>${i.substr(0, rightInput.value.length)}</b>`;
            word += i.substr(rightInput.value.length);
            listItem.innerHTML = word;
            rightList.appendChild(listItem);
            countR++; // Increment count
        }
    }
});

/////////////////// functions
function displayNames(input, name, list) {
    input.value = name;
    removeElements(list);
}

function removeElements(list) {
    let items = list.querySelectorAll('.list-items');
    items.forEach((item) => {
        item.remove();
    });
}