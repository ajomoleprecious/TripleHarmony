// Select elements from the DOM
let pokeballToHide = document.querySelector(".pokemon_hide img:nth-child(1)"),
    pokeballDance = document.querySelector(".pokemon_hide img:nth-child(2)"),
    currentPokemon = document.querySelector(".current-pokemon");

// Add a click event listener to the first Pokeball image
pokeballToHide.addEventListener("click", () => {
    // Hide the first Pokeball
    pokeballToHide.style.display = "none";

    // Show the dancing Pokeball
    pokeballDance.style.display = "block";

    // After 1 second (1000 milliseconds)
    setTimeout(() => {
        // Display the current Pokemon and change its class to 'show'
        currentPokemon.style.display = "flex";
        currentPokemon.classList.remove("hide");
        currentPokemon.classList.add("show");

        // After 5 seconds (5000 milliseconds), hide the current Pokemon again
        setTimeout(() => {
            currentPokemon.classList.remove("show");
            currentPokemon.classList.add("hide");

            // Hide the dancing Pokeball and show the first Pokeball
            pokeballDance.style.display = "none";
            pokeballToHide.style.display = "block";
        }, 5000);

        // After 6 seconds (6000 milliseconds), completely hide the current Pokemon
        setTimeout(() => {
            currentPokemon.style.display = "none";
        }, 6000);
    }, 1000);
});
