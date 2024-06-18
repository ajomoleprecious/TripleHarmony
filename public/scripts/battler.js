let pokemonToFight = document.querySelector(".battlefield article:nth-child(2) img"),
    fightButtons = document.querySelectorAll(".aanvallen li"),
    punchAnim = document.querySelector(".pokemon-damage img:nth-child(2)");

const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const attacks = document.querySelectorAll('ul.aanvallen li');


// Modal setup for battle choices
const choiceModal = new bootstrap.Modal(document.getElementById("battleChoice"), { keyboard: false, backdrop: "static" });
const pvpFriendModal = new bootstrap.Modal(document.getElementById("pvpfriend"), { keyboard: false, backdrop: "static" });
const pvpStrangerModal = new bootstrap.Modal(document.getElementById("pvpstranger"), { keyboard: false, backdrop: "static" });
const waitforfriend = new bootstrap.Modal(document.getElementById("waitforfriend"), { keyboard: false, backdrop: "static" });
const won = new bootstrap.Modal(document.getElementById("won"), { keyboard: false, backdrop: "static" });
const lost = new bootstrap.Modal(document.getElementById("lost"), { keyboard: false, backdrop: "static" });

const linkInputGroup = document.getElementById("linkInputgroup"),
    linkInput = document.getElementById("linkInput"),
    small = document.querySelector("#pvpfriend small"),
    waitP = document.querySelector("#pvpfriend p"),
    joinRoomBtn = document.getElementById("joinroom");

// Handle link input group click
linkInputGroup.addEventListener("click", () => {
    linkInputGroup.style.border = "3px solid green";
    linkInputGroup.style.borderRadius = "10px";
    small.style.display = "block";
    waitP.style.display = "block";
    joinRoomBtn.style.display = "block";
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    document.execCommand("copy");
    // Share the link
    navigator.share({
        title: "Pokemon Battler - PvP with me",
        url: linkInput.value,
    });
});

// Establish socket connection
const socket = io();

let players = [];

// Handle player count update
socket.on("updatePlayerCount", (playerCount) => {
    document.getElementById("players").textContent = playerCount;
});

// Handle room full event
socket.on('roomFull', () => {
    alert("Deze kamer is al vol met spelers");
    window.location.href = "/pokemon-battler/";
});

// Handle waiting for player
socket.on('waitingForPlayer', () => {
    waitforfriend.show();
});

// Handle start game event and set players
socket.on('startGame', (socket1, socket2) => {
    players[0] = socket1; // Assuming player1
    players[1] = socket2; // Assuming player2
    player1.style.display = "block";
    player2.style.display = "block";
    choiceModal.hide();
    pvpFriendModal.hide();
    pvpStrangerModal.hide();
    waitforfriend.hide();
});

let player1HP;
// Handle setting Player 1's Pokémon
socket.on('setPlayer1', (pokemon) => {
    player1HP = pokemon.pokemonHP;
    player1.src = pokemon.pokemonBackGif || pokemon.pokemonBackImg;
    attacks.forEach((attack, index) => {
        attack.textContent = pokemon.pokemonMoves[index];
    });
    document.querySelector("#player1Progress p").textContent += pokemon.pokemonHP;
});

let player2HP;
// Handle setting Player 2's Pokémon
socket.on('setPlayer2', (pokemon) => {
    player2HP = pokemon.pokemonHP;
    player2.src = pokemon.pokemonGif || pokemon.pokemonImg;
    document.querySelector("#player2Progress p").textContent += pokemon.pokemonHP;
});

let currentPlayer;

// Function to enable or disable attack buttons based on current player
function updateAttackButtons() {
    fightButtons.forEach((button) => {
        if (socket.id === currentPlayer) {
            button.style.backgroundColor = "var(--orange)";
            button.disabled = false;
            button.style.pointerEvents = "auto";
        } else {
            button.style.backgroundColor = "grey";
            button.disabled = true;
            button.style.pointerEvents = "none";
        }
    });
}

// Update current player and bind attack button events
socket.on('currentPlayer', (player) => {
    currentPlayer = player;
    console.log("Switching to player: " + currentPlayer);
    updateAttackButtons();
});

// Handle attacks from Player 1 to Player 2
socket.on('attackFromPlayer1', (damage) => {
    // Make the punch animation visible
    punchAnim.style.display = "block";

    // Apply the damage animation to player 2
    player1.style.animation = "damage 0.5s";
    player1.style.animationDelay = "0s";  // Apply immediately without delay

    // Remove punch animation after 1 second
    setTimeout(() => {
        punchAnim.style.display = "none";
    }, 1000);

    // Reset player 2 animation after 0.5 seconds
    setTimeout(() => {
        player1.style.animation = "none";
    }, 500);
    let currentHP = parseInt(player1HP - damage);
    if (currentHP <= 0) {
        currentHP = 0;
    }
    player1HP = currentHP;
    // Update player 1 health
    const player1Health = document.querySelector("#player1Progress p");
    player1Health.innerHTML = `&hearts;&nbsp;HP&nbsp;${currentHP}`;
    if (currentHP <= 0) {
        if (socket.id === players[0]) {
            won.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }else {
            lost.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }
    }
});

// Handle attacks from Player 2 to Player 1
socket.on('attackFromPlayer2', (damage) => {
    // Make the punch animation visible
    punchAnim.style.display = "block";

    // Apply the damage animation to player 1
    player1.style.animation = "damage 0.5s";
    player1.style.animationDelay = "0s";  // Apply immediately without delay

    // Remove punch animation after 1 second
    setTimeout(() => {
        punchAnim.style.display = "none";
    }, 1000);

    // Reset player 1 animation after 0.5 seconds
    setTimeout(() => {
        player1.style.animation = "none";
    }, 500);
    let currentHP = parseInt(player1HP - damage);
    if (currentHP <= 0) {
        currentHP = 0;
    }
    player1HP = currentHP;
    // Update player 1 health
    const player1Health = document.querySelector("#player1Progress p");
    player1Health.innerHTML = `&hearts;&nbsp;HP&nbsp;${currentHP}`;
    if (currentHP <= 0) {
        if (socket.id === players[1]) {
            won.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }else {
            lost.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }
    }
});

// Handle receiving damage from Player 1
socket.on('receiveAttackFromPlayer1', (damage) => {
    // Display the punch animation
    punchAnim.style.display = "block";

    // Apply the damage animation to Player 2
    player2.style.animation = "damage 0.5s";
    player2.style.animationDelay = "0s";  // Start the animation immediately

    // Hide the punch animation after 1 second
    setTimeout(() => {
        punchAnim.style.display = "none";
    }, 1000);

    // Reset Player 2 animation after 0.5 seconds
    setTimeout(() => {
        player2.style.animation = "none";
    }, 500);
    let currentHP = parseInt(player2HP - damage);
    if (currentHP <= 0) {
        currentHP = 0;
    }
    player2HP = currentHP;
    // Update Player 2 health
    const player2Health = document.querySelector("#player2Progress p");
    player2Health.innerHTML = `&hearts;&nbsp;HP&nbsp;${currentHP}`;
    if (currentHP <= 0) {
        if (socket.id === players[1]) {
            won.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }else {
            lost.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }
    }
});

// Handle receiving damage from Player 2
socket.on('receiveAttackFromPlayer2', (damage) => {
    // Display the punch animation
    punchAnim.style.display = "block";

    // Apply the damage animation to Player 1
    player2.style.animation = "damage 0.5s";
    player2.style.animationDelay = "0s";  // Start the animation immediately

    // Hide the punch animation after 1 second
    setTimeout(() => {
        punchAnim.style.display = "none";
    }, 1000);

    // Reset Player 1 animation after 0.5 seconds
    setTimeout(() => {
        player2.style.animation = "none";
    }, 500);
    let currentHP = parseInt(player2HP - damage);
    if (currentHP <= 0) {
        currentHP = 0;
    }
    player2HP = currentHP;
    // Update Player 1 health
    const player2Health = document.querySelector("#player2Progress p");
    player2Health.innerHTML = `&hearts;&nbsp;HP&nbsp;${currentHP}`;
    if (currentHP <= 0) {
        if (socket.id === players[0]) {
            won.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }else {
            lost.show();
            setTimeout(() => {
                window.location.href = "/pokemon-battler/";
            }, 6000);
        }
    }
});


// Update fight buttons' event listeners based on current player
attacks.forEach((attack) => {
    attack.addEventListener("click", () => {
        if (socket.id === players[0]) {
            socket.emit('attackPlayer2FromPlayer1');
        } else if (socket.id === players[1]) {
            socket.emit('attackPlayer1FromPlayer2');
        }
    });
});

// Handle player disconnection
socket.on('playerDisconnected', () => {
    alert("De verbinding is verbroken door u of uw tegenstander. 😞");
    window.location.href = "/pokemon-battler/";
});

// Check URL for roomID and join room if exists
const urlParams = new URL(window.location.href).searchParams;
const roomID = urlParams.get("roomID");

if (roomID) {
    socket.emit('joinRoom', roomID);
} else {
    choiceModal.show();
    socket.on("connect", () => {
        const roomID = generateRoomID();
        linkInput.value = `${window.location.origin}/pokemon-battler/?roomID=${roomID}`;
        joinRoomBtn.href = linkInput.value;
    });
}

// If stranger modal is shown, join a random PvP room
pvpStrangerModal._element.addEventListener("shown.bs.modal", () => {
    socket.emit('joinRandomPvP');
});

// Function to generate room ID
function generateRoomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
