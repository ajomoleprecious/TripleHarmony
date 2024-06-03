const inputWho = document.getElementById("inputWho"),
    hint = document.getElementById("hint"),
    result = document.querySelector(".result"),
    mask = document.querySelector(".mask"),
    skip = document.querySelector(".skip"),
    startContainer = document.getElementById("startMessage"),
    timer = document.getElementById("timer");

let hintCount = 1,
    countdownTimer,
    countdownStarted = false;

async function getNewPokemon() {
    document.querySelector(".silhouette").src = "/assets/others/loading-ball.gif";
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    mask.style.display = "none";
    mask.style.clip = "rect(0px, 0px, 15rem, 0px)";
    inputWho.value = "";
    hintCount = 1;
    let e = await fetch("/who's-that-pokemon/new-pokemon"),
        t = await e.json();
    setTimeout(() => {
        document.querySelector(".silhouette").style.filter = "brightness(0%)";
    }, 600);
    setTimeout(() => {
        mask.style.display = "block";
        document.querySelector(".silhouette").src = t.image;
        mask.src = t.image;
        localStorage.setItem("pokemonName", t.name);
        result.innerText = "Toon resultaat";
    }, 500);
    clearInterval(countdownTimer);
    timer.textContent = "15";
    startCountdown();
}

function startCountdown() {
    countdownTimer = setInterval(() => {
        let currentTime = parseInt(timer.textContent);
        if (currentTime > 0) {
            timer.textContent = currentTime - 1;
        } else {
            clearInterval(countdownTimer);
            getNewPokemon();
        }
    }, 1000);
}

hint.addEventListener("click", () => {
    if (hintCount >= localStorage.getItem("pokemonName").length) {
        mask.style.clip = "rect(0px, auto, 15rem, 0px)";
        inputWho.value = localStorage.getItem("pokemonName");
        setTimeout(() => {
            getNewPokemon();
        }, 2000);
        return;
    }
    let e = localStorage.getItem("pokemonName"),
        t = document.querySelector(".silhouette").width;
    mask.style.clip = `rect(0px, ${t/e.length*hintCount}px, 15rem, 0px)`;
    inputWho.value = e.substring(0, hintCount);
    hintCount++;
});

inputWho.addEventListener("input", async () => {
    if (inputWho.value.toLowerCase() === localStorage.getItem("pokemonName").toLowerCase()) {
        result.innerText = "Correct!";
        let e = Math.floor(3 * Math.random() + 1);
        if (hintCount === 1) {
            if (e === 1) await fetch("/who's-that-pokemon/award/attack/2");
            else if (e === 2) await fetch("/who's-that-pokemon/award/hp/2");
            else await fetch("/who's-that-pokemon/award/defense/2");
        } else {
            if (e === 1) await fetch("/who's-that-pokemon/award/attack/1");
            else if (e === 2) await fetch("/who's-that-pokemon/award/hp/1");
            else await fetch("/who's-that-pokemon/award/defense/1");
        }
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        setTimeout(() => {
            getNewPokemon();
        }, 2500);
    }
});

result.addEventListener("click", () => {
    hint.style.display = "none";
    skip.style.display = "none";
    inputWho.value = localStorage.getItem("pokemonName");
    document.querySelector(".silhouette").style.filter = "brightness(100%)";
    clearInterval(countdownTimer);
    timer.textContent = "15";
    setTimeout(() => {
        getNewPokemon();
        startCountdown();
        hint.style.display = "inline-block";
        skip.style.display = "inline-block";
    }, 2000);
});

if (window.innerWidth <= 710) {
    startContainer.innerHTML = `Wie is deze Pok\xe9mon ?
        <br>
        <br>
        Klik om te starten!`;
    startContainer.addEventListener("click", function() {
        document.getElementById("startMessage").style.display = "none";
        startCountdown();
    });
} else {
    document.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            document.getElementById("startMessage").style.display = "none";
            startCountdown();
        }
    });
}

window.onload = () => {
    let e = document.getElementById("pokemonName").value;
    localStorage.setItem("pokemonName", e);
    e.innerText = "";
};
