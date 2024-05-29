const inputWho = document.getElementById("inputWho");
const hint = document.getElementById("hint");
const result = document.querySelector(".result");
const mask = document.querySelector(".mask");
const skip = document.querySelector(".skip");

let hintCount = 1;
let countdownTimer;

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

    clearInterval(countdownTimer);
    timer.textContent = "15";
    countdownTimer = setInterval(() => {
        timer.textContent = parseInt(timer.textContent) - 1;
        if (parseInt(timer.textContent) === 0) {
            getNewPokemon();
        }
    }, 1000);
}

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

    const pokemonName = localStorage.getItem("pokemonName"); // cache the value
    const silhouetteWidth = document.querySelector(".silhouette").width;
    mask.style.clip = `rect(0px, ${(silhouetteWidth / pokemonName.length * hintCount)}px, 15rem, 0px)`;
    inputWho.value = pokemonName.substring(0, hintCount); // use substring here
    hintCount++;
});

inputWho.addEventListener("input", async () => {
    if (inputWho.value.toLowerCase() === localStorage.getItem("pokemonName").toLowerCase()) {
        console.log("Je hebt twee punten gewonnen!");
        result.innerText = "Correct!";
        const choice = Math.floor(Math.random() * 3 + 1);
        if (hintCount === 1) { // if hint was not used
            if (choice === 1) {
                await fetch("/who's-that-pokemon/award/attack/2");
            } else {
                await fetch("/who's-that-pokemon/award/defense/2");
            }
        }
        else{
            if (choice === 1) { // if hint was used
                await fetch("/who's-that-pokemon/award/attack/1");
            } else {
                await fetch("/who's-that-pokemon/award/defense/1");
            }
        }
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        setTimeout(() => {
            getNewPokemon();
        }, 2500);
    }
});

result.addEventListener("click", () => {
    // Hide the hint and skip buttons
    hint.style.display = 'none';
    skip.style.display = 'none';

    inputWho.value = localStorage.getItem("pokemonName");
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    clearInterval(countdownTimer);
    timer.textContent = "15";  // Reset the timer display
    setTimeout(() => {
        getNewPokemon();
        // Start a new timer
        countdownTimer = setInterval(() => {
            timer.textContent = parseInt(timer.textContent) - 1;
            if (parseInt(timer.textContent) === 0) {
                getNewPokemon();
            }
        }, 1000);

        // Show the hint and skip buttons again after 2 seconds
        hint.style.display = 'inline-block';
        skip.style.display = 'inline-block';
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
        if (event.key === "Enter") {
            document.getElementById('startMessage').style.display = 'none';
        }
    });
}

window.onload = () => {
    const name = document.getElementById("pokemonName").value;
    localStorage.setItem("pokemonName", name);
    name.innerText = "";
    getNewPokemon();
};

const timer = document.getElementById('timer');