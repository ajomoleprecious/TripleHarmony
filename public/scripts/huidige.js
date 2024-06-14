async function getPokemon(e) {
    let t = document.getElementById("pokemonsLabel"),
        n = document.getElementById("pokemondetailImg"),
        o = document.getElementById("pokemonSetLink"),
        a = document.getElementById("pokemonName"),
        i = await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`),
        m = await i.json();
    t.innerText = m.name.toString().charAt(0).toUpperCase() + m.name.toString().slice(1), n.src = m.sprites.other["official-artwork"].front_default, a.innerText = m.name, o.addEventListener("click", async () => {
        await fetch(`./changeCurrentPokemon/${e}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(e => {
            e.ok && location.reload()
        })
    })
}
const pokemonSearch = document.getElementById("pokemonSearch");
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
count = 0;
pokemonSearch.addEventListener("keyup", e => {
    for (let t of (removeElements(leftList), count = 0, sortedPokemonNames))
        if (t.toLowerCase().startsWith(pokemonSearch.value.toLowerCase()) && "" !== pokemonSearch.value) {
            if (count >= 3) break;
            let n = document.createElement("li");
            n.classList.add("list-items"), n.style.cursor = "pointer", n.addEventListener("click", function() {
                displayNames(pokemonSearch, t, leftList)
            });
            let o = `<b>${t.substr(0,pokemonSearch.value.length)}</b>`;
            o += t.substr(pokemonSearch.value.length), n.innerHTML = o, leftList.appendChild(n), count++
        }
});
function removeElements(e) {
    e.querySelectorAll(".list-items").forEach(e => {
        e.remove()
    })
}
function displayNames(e, t, n) {
    e.value = t, removeElements(n)
}