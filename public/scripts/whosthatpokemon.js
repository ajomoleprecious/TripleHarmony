
const inputWho = document.getElementById("inputWho");
const hint = document.getElementById("hint");
const pokemonName = document.getElementById("pokemonName");
const result = document.querySelector(".result");
let hintCount = 0;

async function getNewPokemon() {
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    document.querySelector(".silhouette").src = "/assets/others/loading-ball.gif";
    inputWho.value = "";
    hintCount = 0;
    const newPokemon = await fetch("/who's-that-pokemon/new-pokemon");
    const data = await newPokemon.json();
    setTimeout(() => {
        document.querySelector(".silhouette").style.filter = "brightness(0%)";
    }, 600);
    setTimeout(() => {
        document.querySelector(".silhouette").src = data.image;
        pokemonName.value = data.name;
        result.innerText = "Toon resultaat";
    }, 500);
};

hint.addEventListener("click", () => {
    if (hintCount === pokemonName.value.length) {
        return;
    }
    inputWho.value += pokemonName.value.charAt(hintCount);
    hintCount++;
});

inputWho.addEventListener("input", () => {
    if (inputWho.value === pokemonName.value) {
        result.innerText = "Correct!";
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        setTimeout(() => {
            getNewPokemon();
        }, 2500);
    }
});

result.addEventListener("click", () => {
    inputWho.value = pokemonName.value;
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    setTimeout(() => {
        getNewPokemon();
    }, 2000);
});