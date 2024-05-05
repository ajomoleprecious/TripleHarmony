
const inputWho = document.getElementById("inputWho");
const hint = document.getElementById("hint");
const pokemonName = document.getElementById("pokemonName");
const result = document.querySelector(".result");
const mask = document.querySelector(".mask");
let hintCount = 1;

async function getNewPokemon() {
    document.querySelector(".silhouette").src = "/assets/others/loading-ball.gif";
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    
    mask.style.display = "none";
    mask.style.clip = "rect(0px, 0px, 15rem, 0px)";
    
    inputWho.value = "";
    hintCount = 1;
    const newPokemon = await fetch("/who's-that-pokemon/new-pokemon");
    const data = await newPokemon.json();
    setTimeout(() => {
        document.querySelector(".silhouette").style.filter = "brightness(0%)";
    }, 600);
    setTimeout(() => {
        mask.style.display = "block";
        document.querySelector(".silhouette").src = data.image;
        mask.src = data.image;
        pokemonName.value = data.name;
        result.innerText = "Toon resultaat";
    }, 500);
};



hint.addEventListener("click", () => {
    if (hintCount >= pokemonName.value.length) {
        // Reset the clip to show the entire image
        mask.style.clip = `rect(0px, auto, 15rem, 0px)`;
        inputWho.value = pokemonName.value;
        setTimeout(() => {
            getNewPokemon();
        }, 2000);
        return;
    }

    const silhouetteWidth = document.querySelector(".silhouette").width;
    mask.style.clip = `rect(0px, ${(silhouetteWidth / pokemonName.value.length * hintCount ) }px, 15rem, 0px)`;
    inputWho.value += pokemonName.value.charAt(hintCount - 1);
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