let pokeballTohide = document.querySelector(".pokemon_hide img:nth-child(1)");
let pokeballDance = document.querySelector(".pokemon_hide img:nth-child(2)");
let currentPokemon = document.querySelector(".current-pokemon");

pokeballTohide.addEventListener('click', () => {
    pokeballTohide.style.display = "none";
    pokeballDance.style.display = "block";
    setTimeout(() => {
        currentPokemon.style.display = "flex";
        currentPokemon.classList.remove("hide");
        currentPokemon.classList.add("show");
        setTimeout(() => {
            currentPokemon.classList.remove("show");
            currentPokemon.classList.add("hide");
            pokeballDance.style.display = "none";
            pokeballTohide.style.display = "block";
        }, 5000);
        setTimeout(() => {
            currentPokemon.style.display = "none";
        }, 6000);
    }, 2000);
});