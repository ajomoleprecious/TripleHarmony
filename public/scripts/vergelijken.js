const leftInput = document.querySelector('input[name="left_pokemon"]'),
    rightInput = document.querySelector('input[name="right_pokemon"]'),
    form = document.getElementById("vergelijkenForm");

function handleKeyPress(e) {
    13 === e.keyCode && (leftInput.value && rightInput.value ? form.submit() : alert("Gelieve twee pokemons namen in te geven."))
}

function submitForm(e) {
    leftInput.value && rightInput.value ? form.submit() : alert("Gelieve twee pokemons namen in te geven.")
}
async function fetchAllPokemons() {
    let e = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000"),
        t = await e.json();
    return t.results
}

function sortArray(e) {
    return e.map(e => e.name).sort()
}
let pokemonArray = [],
    sortedPokemonNames = [];
async function main() {
    sortedPokemonNames = sortArray(pokemonArray = await fetchAllPokemons())
}
main();
let leftList = document.getElementsByClassName("left-pokemon-list")[0],
    rightList = document.getElementsByClassName("right-pokemon-list")[0],
    count = 0;
leftInput.addEventListener("keyup", e => {
    for (let t of (removeElements(leftList), count = 0, sortedPokemonNames))
        if (t.toLowerCase().startsWith(leftInput.value.toLowerCase()) && "" !== leftInput.value) {
            if (count >= 3) break;
            let n = document.createElement("li");
            n.classList.add("list-items"), n.style.cursor = "pointer", n.addEventListener("click", function() {
                displayNames(leftInput, t, leftList)
            });
            let o = `<b>${t.substr(0,leftInput.value.length)}</b>`;
            o += t.substr(leftInput.value.length), n.innerHTML = o, leftList.appendChild(n), count++
        }
});
let countR = 0;

function displayNames(e, t, n) {
    e.value = t, removeElements(n)
}

function removeElements(e) {
    e.querySelectorAll(".list-items").forEach(e => {
        e.remove()
    })
}
rightInput.addEventListener("keyup", e => {
    for (let t of (removeElements(rightList), countR = 0, sortedPokemonNames))
        if (t.toLowerCase().startsWith(rightInput.value.toLowerCase()) && "" !== rightInput.value) {
            if (countR >= 3) break;
            let n = document.createElement("li");
            n.classList.add("list-items"), n.style.cursor = "pointer", n.addEventListener("click", function() {
                displayNames(rightInput, t, rightList)
            });
            let o = `<b>${t.substr(0,rightInput.value.length)}</b>`;
            o += t.substr(rightInput.value.length), n.innerHTML = o, rightList.appendChild(n), countR++
        }
});