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
let choiceModal = new bootstrap.Modal(document.getElementById("battleChoice"), { keyboard: !1, backdrop: "static" });
choiceModal.show();
const linkInputgroup = document.getElementById("linkInputgroup"),
    linkInput = document.getElementById("linkInput"),
    small = document.querySelector("#pvpfriend small"),
    waitP = document.querySelector("#pvpfriend p"),
    waitImg = document.querySelector("#pvpfriend img");
linkInputgroup.addEventListener("click", () => {
    (linkInputgroup.style.border = "3px solid green"),
        (linkInputgroup.style.borderRadius = "10px"),
        (small.style.display = "block"),
        (waitP.style.display = "block"),
        (waitImg.style.display = "block"),
        linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    document.execCommand("copy");
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

// Check for roomID in the URL and join room
const urlParams = new URL(window.location.href).searchParams;
const roomID = urlParams.get("roomID");

if (roomID) {
    // If roomID parameter exists in the URL, join that room
    // Join a specific room
    socket.emit('joinRoom', roomID);
} else {
    // Otherwise, generate a new room link
    socket.on("connect", () => {
        const linkInput = document.getElementById("linkInput");
        linkInput.value = `${window.location.origin}/pokemon-battler/?roomID=${socket.id}`;
        socket.emit('joinRoom', socket.id);
    });
}

// Window event on page leave
window.addEventListener("beforeunload", () => {
    if (roomID) {
        socket.emit('leaveRoom', roomID);
    }
    socket.disconnect();
});