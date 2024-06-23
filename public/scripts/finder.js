// Constants for the number of bushes to generate
const NUM_BUSHES_PC = 3000;  // Number of bushes on PC
const NUM_BUSHES_MOBILE = 1000;  // Number of bushes on mobile
const NUM_BALLS = 5;  // Number of Pokéballs to generate

// DOM elements
let hideHelp = document.getElementById("hideHelp");
let player = document.querySelector(".player");
let mainTag = document.querySelector("main");

// Initial player position and velocity
let player_pos = {
    x: parseInt(window.innerWidth / 2),
    y: parseInt(window.innerHeight / 2)
};
let player_vel = {
    x: 0,
    y: 0
};

// Array to keep track of generated balls
let balls = [];

// Audio elements for walking and battle sounds
let walking = new Audio("../assets/finder-files/walking.ogg");
let battleSound = new Audio("../assets/finder-files/tension_sound.ogg");

// Joystick initialization
var joy = new JoyStick("joyDiv");

// Function to handle joystick movements
function handleJoystickMovement() {
    var direction = joy.GetDir();

    switch (direction) {
        case "N":
            player_vel.y = 0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add("active");
            break;
        case "NE":
            player_vel.y = 0.5;
            player_vel.x = 0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add("active");
            break;
        case "E":
            player_vel.x = 0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_right.png")';
            player.classList.add("active");
            break;
        case "SE":
            player_vel.y = -0.5;
            player_vel.x = 0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add("active");
            break;
        case "S":
            player_vel.y = -0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add("active");
            break;
        case "SW":
            player_vel.y = -0.5;
            player_vel.x = -0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add("active");
            break;
        case "W":
            player_vel.x = -0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_left.png")';
            player.classList.add("active");
            break;
        case "NW":
            player_vel.y = 0.5;
            player_vel.x = -0.5;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add("active");
            break;
        default:
            player_vel.x = 0;
            player_vel.y = 0;
            player.classList.remove("active");
    }
}

// Function to create bushes
function createBushes() {
    let mainElement = document.querySelector("main");

    if (window.innerWidth <= 800) {
        // Mobile version
        document.body.style.backgroundSize = "cover";
        document.querySelector("#joyDiv").style.visibility = "visible";
        for (let i = 0; i < NUM_BUSHES_MOBILE; i++) {
            let bush = document.createElement("div");
            bush.classList.add("bush");
            bush.style.left = Math.max(1, Math.random() * (window.innerWidth - 50)) + "px";
            bush.style.top = Math.max(10, Math.random() * (window.innerHeight - 110)) + "px";
            mainElement.appendChild(bush);
        }
    } else {
        // PC version
        for (let i = 0; i < NUM_BUSHES_PC; i++) {
            let bush = document.createElement("div");
            bush.classList.add("bush");
            bush.style.left = Math.max(1, Math.random() * (window.innerWidth - 55)) + "px";
            bush.style.top = Math.max(10, Math.random() * (window.innerHeight - 100)) + "px";
            mainElement.appendChild(bush);
        }
    }
}

// Function to generate a single Pokéball
function generateBall() {
    if (balls.length < NUM_BALLS) {
        let ball = document.createElement("div");
        ball.classList.add("pokeball");
        ball.style.position = "absolute";

        let maxWidth = window.innerWidth - 50;
        let maxHeight = window.innerHeight - 110;
        let leftPosition = Math.max(Math.min(1, maxWidth), Math.random() * maxWidth) + "px";
        let topPosition = Math.max(Math.min(10, maxHeight), Math.random() * maxHeight) + "px";

        ball.style.left = leftPosition;
        ball.style.top = topPosition;

        balls.push({
            ball: ball,
            pos: {
                x: leftPosition,
                y: topPosition
            }
        });
        mainTag.appendChild(ball);
    }
}

// Function to create multiple Pokéballs
function createBalls() {
    for (let i = 0; i < NUM_BALLS; i++) {
        generateBall();
    }
}

// Function to check collision between two elements
function collision(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    return !(
        rect1.top + rect1.height < rect2.top ||
        rect1.top > rect2.top + rect2.height ||
        rect1.left + rect1.width < rect2.left ||
        rect1.left > rect2.left + rect2.width
    );
}

// Function to fetch and display a random Pokémon
async function getRandomPokemon() {
    let pokemonName = document.getElementById("randomPokemonName");
    let pokemonImage = document.getElementById("randomPokemonImage");
    let pokemonLink = document.getElementById("randomPokemonID");

    // Clear previous Pokémon data
    pokemonName.innerText = "";
    pokemonImage.src = "";
    pokemonLink.href = "";

    // Fetch random Pokémon data from server
    try {
        let response = await fetch("/pokemon-finder/random-pokemon", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();

        // Display fetched Pokémon data in the modal
        pokemonName.innerText = data.pokeNaam;
        pokemonLink.href = `/pokemon-battler-vs-pc/${data.pokeNaam.toLowerCase()}`;
        pokemonImage.src = data.pokeURL;
        modal.show();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Initialize the modal for displaying Pokémon
let modal = new bootstrap.Modal(document.getElementById("pokemonFinder"), {
    keyboard: false,
    backdrop: "static"
});

// Function to check for collisions between the player and Pokéballs
function checkCollisions() {
    balls.forEach((ballObj, index) => {
        if (collision(ballObj.ball, player)) {
            ballObj.ball.remove();  // Remove the ball from the DOM
            balls.splice(index, 1);  // Remove the ball from the array
            generateBall();  // Generate a new ball
            getRandomPokemon();  // Fetch and display a random Pokémon
        }
    });
}

// Function to play a sound with proper interaction handling for autoplay
function playSound(sound) {
    var startPlaying = function() {
        var playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {}).catch((error) => {
                console.error("Autoplay prevented:", error);
            });
        }
        sound.loop = true;
    };

    var onInteraction = function() {
        document.removeEventListener("click", onInteraction);
        document.removeEventListener("touchstart", onInteraction);
        startPlaying();
    };

    if (document.interactionListener) {
        startPlaying();
    } else {
        document.addEventListener("click", onInteraction);
        document.addEventListener("touchstart", onInteraction);
        document.interactionListener = true;
    }
}

// Function to stop a sound
function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

// Main game loop to update player position and handle collisions
function run() {
    // Update player position based on velocity
    player_pos.x += player_vel.x;
    player_pos.y += player_vel.y;

    // Play or stop walking sound based on movement
    if (player_vel.x !== 0 || player_vel.y !== 0) {
        playSound(walking);
    } else {
        stopSound(walking);
    }

    // Boundary checks for player position
    if (player_pos.x < 0) {
        player_pos.x = 0;
    } else if (player_pos.x > window.innerWidth - player.offsetWidth) {
        player_pos.x = window.innerWidth - player.offsetWidth;
    }
    if (player_pos.y < 0) {
        player_pos.y = 0;
    } else if (player_pos.y > window.innerHeight - player.offsetHeight) {
        player_pos.y = window.innerHeight - player.offsetHeight;
    }

    // Update player element position
    player.style.left = player_pos.x + "px";
    player.style.bottom = player_pos.y + "px";

    // Check for collisions with Pokéballs
    checkCollisions();

    // Continue the animation loop
    requestAnimationFrame(run);
}

// Initialize the game
function init() {
    createBushes();  // Generate bushes
    createBalls();  // Generate Pokéballs
    run();  // Start the game loop
}

// Start initialization
init();

// Handle joystick movements for mobile devices
if (window.innerWidth <= 800) {
    setInterval(handleJoystickMovement, 20);
}

// Add event listeners for modal interactions to manage sounds
modal._element.addEventListener("hidden.bs.modal", () => {
    stopSound(walking);
    stopSound(battleSound);
});

modal._element.addEventListener("shown.bs.modal", () => {
    playSound(battleSound);
});

// Set to keep track of currently pressed keys
const keysPressed = new Set();

// Handle keydown events to move the player
window.addEventListener("keydown", function(event) {
    keysPressed.add(event.key);

    if (modal && modal._element.classList.contains("show")) {
        player_vel.x = 0;
        player_vel.y = 0;
    } else {
        if (keysPressed.has("ArrowUp")) {
            player_vel.y = 0.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
        }
        if (keysPressed.has("ArrowDown")) {
            player_vel.y = -0.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
        }
        if (keysPressed.has("ArrowLeft")) {
            player_vel.x = -0.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_left.png")';
        }
        if (keysPressed.has("ArrowRight")) {
            player_vel.x = 0.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_right.png")';
        }
        player.classList.add("active");
    }
});

// Handle keyup events to stop player movement
window.addEventListener("keyup", function(event) {
    keysPressed.delete(event.key);

    if (!keysPressed.has("ArrowUp") && !keysPressed.has("ArrowDown")) {
        player_vel.y = 0;
    }
    if (!keysPressed.has("ArrowLeft") && !keysPressed.has("ArrowRight")) {
        player_vel.x = 0;
    }
    if (keysPressed.size === 0) {
        player.classList.remove("active");
    }
});

// Reload the page on window resize
window.addEventListener("resize", function() {
    location.reload();
});

// Initialize and show the help modal based on local storage setting
let hulpModal = new bootstrap.Modal(document.getElementById("hulp"), {
    keyboard: false
});

window.onload = function() {
    if (localStorage.getItem("hideHelp") === "false" || localStorage.getItem("hideHelp") === null) {
        hulpModal.show();
    }
};

// Save the help modal visibility state to local storage
hideHelp.addEventListener("change", function() {
    localStorage.setItem("hideHelp", hideHelp.checked);
});
