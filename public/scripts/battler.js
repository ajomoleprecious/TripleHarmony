let pokemonTofight = document.querySelector(".battlefield article:nth-child(2) img"),
    fightButtons = document.querySelectorAll(".aanvallen li"),
    punchAnim = document.querySelector(".pokemon-damage img:nth-child(2)");
fightButtons.forEach((e) => {
    e.addEventListener("click", () => {
        (punchAnim.style.display = "block"),
            (pokemonTofight.style.animation = "damage .5s"),
            (pokemonTofight.style.animationdelay = "1s"),
            setTimeout(() => {
                punchAnim.style.display = "none";
            }, 1e3),
            setTimeout(() => {
                pokemonTofight.style.animation = "none";
            }, 1500);
    });
});

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const attacks = document.querySelectorAll('ul.aanvallen li');

player1.style.display = "none";
player2.style.display = "none";
attacks.forEach((attack) => {
    attack.style.display = "none";
});

const choiceModal = new bootstrap.Modal(document.getElementById("battleChoice"), { keyboard: !1, backdrop: "static" });
const pvpFriendModal = new bootstrap.Modal(document.getElementById("pvpfriend"), { keyboard: !1, backdrop: "static" });
const pvpStrangerModal = new bootstrap.Modal(document.getElementById("pvpstranger"), { keyboard: !1, backdrop: "static" });

const linkInputgroup = document.getElementById("linkInputgroup"),
    linkInput = document.getElementById("linkInput"),
    small = document.querySelector("#pvpfriend small"),
    waitP = document.querySelector("#pvpfriend p"),
    joinRoomBtn = document.getElementById("joinroom");
linkInputgroup.addEventListener("click", () => {
    (linkInputgroup.style.border = "3px solid green"),
        (linkInputgroup.style.borderRadius = "10px"),
        (small.style.display = "block"),
        (waitP.style.display = "block"),
        (joinRoomBtn.style.display = "block");
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    document.execCommand("copy");
    // share the link
    navigator.share({
        title: "Pokemon Battler - PvP with me",
        url: linkInput.value,
    });
});
const players = document.getElementById("players");
// Establish socket connection
const socket = io();

// Handle the updatePlayerCount event
socket.on("updatePlayerCount", (playerCount) => {
    document.getElementById("players").textContent = playerCount;
});

// Handle the updateRoomPlayerCount event
socket.on("updateRoomPlayerCount", (roomPlayerCount) => {
    document.getElementById("roomPlayers").textContent = roomPlayerCount;
});

// Handle the roomFull event
socket.on('roomFull', () => {
    alert("Deze kamer is al vol met spelers");
    window.location.href = "/pokemon-battler/";
});

// Handle the startGame event
socket.on('startGame', () => {
    console.log("The game is starting!");
    player1.style.display = "block";
    player2.style.display = "block";
    attacks.forEach((attack) => {
        attack.style.display = "block";
    });
    choiceModal.hide();
    pvpFriendModal.hide();
    pvpStrangerModal.hide();
});

// Set Pokémon for both players when the game starts
socket.on('setPlayer1', (pokemon) => {
    if (pokemon.pokemonBackGif == null) {
        player1.src = pokemon.pokemonBackImg;
    }
    else {
        player1.src = pokemon.pokemonBackGif;
    }
    attacks.forEach((attack, index) => {
        attack.textContent = pokemon.pokemonMoves[index];
    });
    document.querySelector("#player1Pogress p").textContent += pokemon.pokemonHP;
});

socket.on('setPlayer2', (pokemon) => {
    if (pokemon.pokemonGif == null) {
        player2.src = pokemon.pokemonImg;
    }
    else {
        player2.src = pokemon.pokemonGif;
    }
    document.querySelector("#player2Pogress p").textContent += pokemon.pokemonHP;
});

socket.on('playerDisconnected', () => {
    alert("U of de ander speler heeft de verbinding verbroken, je wordt nu teruggeleid naar de homepagina");
    window.location.href = "/pokemon-battler/";
});

// Check for roomID in the URL and join room
const urlParams = new URL(window.location.href).searchParams;
const roomID = urlParams.get("roomID");

if (roomID) {
    // If roomID parameter exists in the URL, join that room
    socket.emit('joinRoom', roomID);
} else {
    choiceModal.show();

    // Otherwise, generate a new room link
    socket.on("connect", () => {
        function generateRoomID() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
            let result = '';
            for (let i = 0; i < 5; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        const roomID = generateRoomID();
        const linkInput = document.getElementById("linkInput");
        linkInput.value = `${window.location.origin}/pokemon-battler/?roomID=${roomID}`;
        joinRoomBtn.href = linkInput.value;
    });
}
// if pvpStrangerModal is shown
pvpStrangerModal._element.addEventListener("shown.bs.modal", () => {
    socket.emit('joinRandomPvP');
});


