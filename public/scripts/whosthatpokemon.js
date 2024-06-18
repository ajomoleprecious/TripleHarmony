async function fetchAllPokemons() {
        let e = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000"),
            t = await e.json();
        return t.results;
    }
    
    function sortArray(e) {
        return e.map(e => e.name).sort();
    }
    
    let pokemonArray = [],
        sortedPokemonNames = [];
    
    async function main() {
        sortedPokemonNames = sortArray(pokemonArray = await fetchAllPokemons());
    }
    
    main();
    
    let leftList = document.querySelector(".left-pokemon-list"),
        count = 0;
    
    let inputWho = document.getElementById("inputWho");
    
    inputWho.addEventListener("keyup", e => {
        removeElements(leftList);
        count = 0;
        for (let t of sortedPokemonNames) {
            if (t.toLowerCase().startsWith(inputWho.value.toLowerCase()) && inputWho.value !== "") {
                if (count >= 3) break;
                let n = document.createElement("li");
                n.classList.add("list-items");
                n.style.cursor = "pointer";
                n.addEventListener("click", function () {
                    displayNames(inputWho, t, leftList);
                });
                let o = `<b>${t.substr(0, inputWho.value.length)}</b>`;
                o += t.substr(inputWho.value.length);
                n.innerHTML = o;
                leftList.appendChild(n);
                count++;
            }
        }
    });
    
    function removeElements(e) {
        e.querySelectorAll(".list-items").forEach(e => {
            e.remove();
        });
    }
    
    async function displayNames(e, t, n) {
        e.value = t;
        removeElements(n);

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
    }
    

    // Existing functions for 'Who's that Pokémon' functionality
    const hint = document.getElementById("hint");
    const result = document.querySelector(".result");
    const mask = document.querySelector(".mask");
    const skip = document.querySelector(".skip");
    const startContainer = document.getElementById("startMessage");
    const timer = document.getElementById("timer");
    let hintCount = 1;
    let countdownTimer;
    let countdownStarted = false;
    
    async function getNewPokemon() {
        document.querySelector(".silhouette").src = "/assets/others/loading-ball.gif";
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        mask.style.display = "none";
        mask.style.clip = "rect(0px, 0px, 15rem, 0px)";
        inputWho.value = "";
        hintCount = 1;
        let e = await fetch("/who's-that-pokemon/new-pokemon");
        let t = await e.json();
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
            }
            if (currentTime === 0) {
                hint.style.display = "none";
                skip.style.display = "none";
                result.style.display = "none";
                inputWho.value = localStorage.getItem("pokemonName");
                document.querySelector(".silhouette").style.filter = "brightness(100%)";
                clearInterval(countdownTimer);
                setTimeout(() => {
                    hint.style.display = "inline-block";
                    skip.style.display = "inline-block";
                    result.style.display = "inline-block";
                    getNewPokemon();
                }, 2500);
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
        mask.style.clip = `rect(0px, ${t / e.length * hintCount}px, 15rem, 0px)`;
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

    

    inputWho.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Code to execute when the Enter key is pressed
            event.preventDefault();
        }
    });
    
    result.addEventListener("click", () => {
        hint.style.display = "none";
        skip.style.display = "none";
        result.style.display = "none";
        inputWho.value = localStorage.getItem("pokemonName");
        document.querySelector(".silhouette").style.filter = "brightness(100%)";
        clearInterval(countdownTimer);
        timer.textContent = "15";
        setTimeout(() => {
            getNewPokemon();
            startCountdown();
            hint.style.display = "inline-block";
            skip.style.display = "inline-block";
            result.style.display = "inline-block";
        }, 2500);
    });
    
    if (window.innerWidth <= 710) {
        startContainer.innerHTML = `Wie is deze Pokémon ?
            <br>
            <br>
            Klik om te starten!`;
        startContainer.addEventListener("click", function () {
            document.getElementById("startMessage").style.display = "none";
            startCountdown();
        });
    } else {
        document.addEventListener("keypress", function (e) {
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
    }
    