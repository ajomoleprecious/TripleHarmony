
const inputWho = document.getElementById("inputWho");
const hint = document.getElementById("hint");
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
        localStorage.setItem("pokemonName", data.name);
        result.innerText = "Toon resultaat";
    }, 500);
};



hint.addEventListener("click", () => {
    if (hintCount >= localStorage.getItem("pokemonName").length) {
        // Reset the clip to show the entire image
        mask.style.clip = `rect(0px, auto, 15rem, 0px)`;
        inputWho.value = localStorage.getItem("pokemonName");
        setTimeout(() => {
            getNewPokemon();
        }, 2000);
        return;
    }

    const silhouetteWidth = document.querySelector(".silhouette").width;
    mask.style.clip = `rect(0px, ${(silhouetteWidth / localStorage.getItem("pokemonName").length * hintCount)}px, 15rem, 0px)`;
    inputWho.value += localStorage.getItem("pokemonName").charAt(hintCount - 1);
    hintCount++;
});



inputWho.addEventListener("input", () => {
    if (inputWho.value === localStorage.getItem("pokemonName")) {
        result.innerText = "Correct!";
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        setTimeout(() => {
            getNewPokemon();
        }, 2500);
    }
});

result.addEventListener("click", () => {
    inputWho.value = localStorage.getItem("pokemonName");
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    setTimeout(() => {
        getNewPokemon();
    }, 2000);
});

if (window.innerWidth <= 710) {
    document.getElementById('startMessage').innerHTML =
        `Wie is deze Pokémon ?
    <br>
    <br>
    Klik om te starten!`;
    document.getElementById('startMessage').addEventListener('click', function () {
        document.getElementById('startMessage').style.display = 'none';
    });
} else {
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            document.getElementById('startMessage').style.display = 'none';
        }
    });
}

window.onload = () => {
    const name = document.getElementById("pokemonName").value;
    localStorage.setItem("pokemonName", name);
    name.innerText = "";
};