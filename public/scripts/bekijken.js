let amountOfpokemons = document.getElementById("amountOfPokemons"),
    listForm = document.getElementById("getAmountOfPokemons"),
    pokemonSearch = document.getElementById("pokemonSearch");

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
null === amountOfpokemons || (localStorage.getItem("amountOfPokemons") ? amountOfpokemons.value = localStorage.getItem("amountOfPokemons") : amountOfpokemons.value = 10, amountOfpokemons.addEventListener("change", function () {
    localStorage.setItem("amountOfPokemons", amountOfpokemons.value), listForm.submit()
}));
let previousButton = document.getElementById("previous"),
    nextButton = document.getElementById("next");
previousButton.addEventListener("click", function () {
    let e = parseInt(localStorage.getItem("page"));
    e > 0 && (listForm.querySelector('input[name="page"]').value = e - 1, localStorage.setItem("page", e - 1), listForm.submit())
}), nextButton.addEventListener("click", function () {
    let e = parseInt(localStorage.getItem("page"));
    listForm.querySelector('input[name="page"]').value = e + 1, localStorage.setItem("page", e + 1), listForm.submit()
});
let detailImg = document.getElementById("detailImg"),
    detailWeight = document.getElementById("detailWeight"),
    detailLength = document.getElementById("detailLength"),
    detailType = document.getElementById("detailType"),
    detailName = document.getElementById("detailName"),
    detailbox = document.getElementById("detailbox");
const moreDetails = document.getElementById("moreDetails");
async function DetailOfPokemon(e) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`).then(e => e.json()).then(e => {
        detailWeight.innerHTML = `${e.weight / 10}<sub> kg</sub>`, detailLength.innerHTML = `${e.height / 10}<sub> m</sub>`;
        let t = e.types.map(e => `<span style="background-color: ${typeColors[e.type.name]}">${e.type.name.charAt(0).toUpperCase() + e.type.name.slice(1)}</span>`);
        detailType.innerHTML = t.join(" "), detailName.innerText = `${e.name.charAt(0).toUpperCase() + e.name.slice(1)}`, moreDetails.href = `https://bulbapedia.bulbagarden.net/wiki/${e.name}`, detailImg.src = e.sprites.other["official-artwork"].front_default
    })
}
async function showDetails(e) {
    detailWeight.innerHTML = "", detailLength.innerHTML = "", detailType.innerHTML = "", detailName.innerText = "", detailImg.src = "", await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`).then(e => e.json()).then(e => {
        detailWeight.innerHTML = `${e.weight / 10}<sub> kg</sub>`, detailLength.innerHTML = `${e.height / 10}<sub> m</sub>`;
        let t = e.types.map(e => `<span style="background-color: ${typeColors[e.type.name]}">${e.type.name.charAt(0).toUpperCase() + e.type.name.slice(1)}</span>`);
        detailType.innerHTML = t.join(" "), detailName.innerText = `${e.name.charAt(0).toUpperCase() + e.name.slice(1)}`, moreDetails.href = `https://bulbapedia.bulbagarden.net/wiki/${e.name}`, detailImg.src = e.sprites.other["official-artwork"].front_default
    });
    let t;
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${e}`).then(e => e.json()).then(e => {
        t = e.evolution_chain.url.toString().split("/")[6]
    }), await createPokemonList(t)
}
async function fetchEvolutionChain(e) {
    let t = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${e}`),
        a = await t.json();
    return a
}
async function createPokemonList(e) {
    let t = await fetchEvolutionChain(e),
        a = [],
        n = document.getElementById("evolutionChain");
    if (n.innerHTML = "", Array.isArray(t.chain.evolves_to) && t.chain.evolves_to.length > 0) {
        a.push(t.chain.species.name);
        let i = t.chain.evolves_to;
        for (; i.length > 0;) await Promise.all(i.map(async e => {
            let t = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${e.species.url.split("/")[6]}`),
                n = await t.json();
            return a.push(n.varieties[0].pokemon.name), n
        })), i = i.reduce((e, t) => e.concat(t.evolves_to), [])
    } else await fetch(`https://pokeapi.co/api/v2/pokemon-species/${t.chain.species.url.split("/")[6]}`).then(e => e.json()).then(e => {
        a.push(e.varieties[0].pokemon.name)
    });
    let o = a.map(async e => {
        let t = await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`),
            a = await t.json();
        return {
            name: e,
            data: a
        }
    }),
        s = await Promise.all(o);
    s.forEach(({
        name: e,
        data: t
    }) => {
        let a = document.createElement("li");
        a.onclick = () => DetailOfPokemon(e), a.innerHTML = `
            <img src="${t.sprites.other.showdown.front_default || t.sprites.other["official-artwork"].front_default}" alt="${t.name}">
            <p>${t.name.charAt(0).toUpperCase() + t.name.slice(1)}</p>
        `, n.appendChild(a)
    })
}
window.onload = function () {
    let e = new URLSearchParams(window.location.search),
        t = parseInt(e.get("page")) || 0;
    null !== amountOfpokemons && (listForm.querySelector('input[name="page"]').value = t), localStorage.setItem("page", t)
};
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
            n.classList.add("list-items"), n.style.cursor = "pointer", n.addEventListener("click", function () {
                displayNames(pokemonSearch, t, leftList)
            });
            let o = `<b>${t.substr(0, pokemonSearch.value.length)}</b>`;
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