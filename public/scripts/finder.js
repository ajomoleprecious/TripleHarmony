const NUM_BUSHES_PC = 3000
const NUM_BUSHES_MOBILE = 1000
const NUM_BALLS = 5

const hideHelp = document.getElementById('hideHelp');
const player = document.querySelector('.player')
const player_pos = {
    x: parseInt(window.innerWidth / 2),
    y: parseInt(window.innerHeight / 2)
}
const player_vel = {
    x: 0,
    y: 0
}
const balls = []
let walking = new Audio('../assets/finder-files/walking.ogg');
let battleSound = new Audio('../assets/finder-files/tension_sound.ogg');
const mainTag = document.querySelector('main');

var joy = new JoyStick('joyDiv');

function handleJoystickMovement() {
    var direction = joy.GetDir();

    switch (direction) {
        case "N":
            player_vel.y = 0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add('active');
            break;
        case "NE":
            player_vel.y = 0.50;
            player_vel.x = 0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add('active');
            break;
        case "E":
            player_vel.x = 0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_right.png")';
            player.classList.add('active');
            break;
        case "SE":
            player_vel.y = -0.50;
            player_vel.x = 0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add('active');
            break;
        case "S":
            player_vel.y = -0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add('active');
            break;
        case "SW":
            player_vel.y = -0.50;
            player_vel.x = -0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
            player.classList.add('active');
            break;
        case "W":
            player_vel.x = -0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_left.png")';
            player.classList.add('active');
            break;
        case "NW":
            player_vel.y = 0.50;
            player_vel.x = -0.50;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
            player.classList.add('active');
            break;
        default:
            // Stop player movement if joystick is not actively moving
            player_vel.x = 0;
            player_vel.y = 0;
            player.classList.remove('active');
            break;
    }
}

function createBushes() {
    const mainTag = document.querySelector('main');

    if (window.innerWidth <= 800) { // Check for window width of 800 pixels or lower
        document.body.style.backgroundSize = "cover";
        document.querySelector('#joyDiv').style.visibility = 'visible';
        for (let i = 0; i < NUM_BUSHES_MOBILE; i++) {
            const div = document.createElement('div');
            div.classList.add('bush');
            div.style.left = Math.max(1, Math.random() * (window.innerWidth - 50)) + 'px'; // Random X position
            div.style.top = Math.max(10, Math.random() * (window.innerHeight - 110)) + 'px'; // Random Y position
            mainTag.appendChild(div);
        }
    } else {
        for (let i = 0; i < NUM_BUSHES_PC; i++) {
            const div = document.createElement('div');
            div.classList.add('bush');
            // Limiting the range of random positions for PC view
            div.style.left = Math.max(1, Math.random() * (window.innerWidth - 55)) + 'px'; // Minimum 1px from left
            div.style.top = Math.max(10, Math.random() * (window.innerHeight - 100)) + 'px'; // Minimum 1px from top
            mainTag.appendChild(div);
        }
    }
}



function generateBall() {
    // Check if there are fewer balls than the desired number before generating a new ball
    if (balls.length < NUM_BALLS) {
        const div = document.createElement('div');
        div.classList.add('pokeball');
        div.style.position = 'absolute';

        // Calculate the maximum X and Y positions
        const maxX = window.innerWidth - 50; // Maximum X position
        const maxY = window.innerHeight - 110; // Maximum Y position

        // Calculate the minimum X and Y positions
        const minX = Math.min(1, maxX); // Minimum X position (at least 25px from left)
        const minY = Math.min(10, maxY); // Minimum Y position (at least 10px from top)

        // Generate random positions within the bounds
        let x = Math.max(minX, Math.random() * maxX) + 'px'; // Random X position
        let y = Math.max(minY, Math.random() * maxY) + 'px'; // Random Y position

        div.style.left = x;
        div.style.top = y;
        balls.push({
            ball: div,
            pos: {
                x,
                y
            }
        });
        // Append the ball to the <main> tag
        mainTag.appendChild(div);
    }
}




function createBalls() {
    for (let i = 0; i < NUM_BALLS; i++) {
        generateBall()
    }
}

function collision(ball, player) {
    var ballRect = ball.getBoundingClientRect();
    var playerRect = player.getBoundingClientRect();

    var x1 = ballRect.left;
    var y1 = ballRect.top;
    var h1 = ballRect.height;
    var w1 = ballRect.width;
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = playerRect.left;
    var y2 = playerRect.top;
    var h2 = playerRect.height;
    var w2 = playerRect.width;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
        return false;
    }
    return true;
}

async function getRandomPokemon() {
    const randomPokemonName = document.getElementById('randomPokemonName');
    const randomPokemonImage = document.getElementById('randomPokemonImage');
    const randomPokemonID = document.getElementById('randomPokemonID');
    // clear the previous pokemon
    randomPokemonName.innerText = '';
    randomPokemonImage.src = '';
    randomPokemonID.href = '';
    
    await fetch('/pokemon-finder/random-pokemon', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            randomPokemonName.innerText = data.pokeNaam;
            randomPokemonID.href = `/pokemon-battler-vs-pc/${data.pokeNaam.toLowerCase()}`;
            randomPokemonImage.src = data.pokeURL;
            modal.show();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

let modal = new bootstrap.Modal(document.getElementById('pokemonFinder'), {
    keyboard: false,
    backdrop: 'static'
});
function checkCollisions() {
    balls.forEach((ball, index) => {
        if (collision(ball.ball, player)) {
            ball.ball.remove();
            balls.splice(index, 1);
            generateBall();
            getRandomPokemon();
        }
    });
}

// Function to play the sound
function playSound(sound) {
    // Function to play sound after user interaction
    var playWithInteraction = function () {
        var promise = sound.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                // Autoplay was prevented.
                console.error("Autoplay prevented:", error);
            });
        }
        sound.loop = true; // Loop the sound effect
    };

    // Function to handle user interaction events (click or swipe)
    var handleInteraction = function () {
        // Remove the interaction event listeners after the first interaction
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        playWithInteraction(); // Play sound after interaction
    };

    // Check if the document already has an interaction event listener
    if (!document.interactionListener) {
        // Add interaction event listeners to the document
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
        document.interactionListener = true; // Set a flag to indicate listener is added
    } else {
        // If interaction event listener already exists, play sound immediately
        playWithInteraction();
    }
}


function stopSound(sound) {
    var promise = sound.pause();
    sound.currentTime = 0;

    if (promise !== undefined) {
        promise.then(_ => {
        }).catch(_ => {
            sound.currentTime = 0;
            sound.pause();
        });
    }
}

function run() {
    player_pos.x += player_vel.x;
    player_pos.y += player_vel.y;

    if (player_vel.x !== 0 || player_vel.y !== 0) {
        // If moving, play the walking sound
        playSound(walking);
    } else {
        // If not moving, stop the walking sound
        stopSound(walking);
    }

    // Check if the player exceeds the screen bounds on X-axis
    if (player_pos.x < 0) {
        player_pos.x = 0;
    } else if (player_pos.x > window.innerWidth - player.offsetWidth) {
        player_pos.x = window.innerWidth - player.offsetWidth;
    }
    // Check if the player exceeds the screen bounds on Y-axis
    if (player_pos.y < 0) {
        player_pos.y = 0;
    } else if (player_pos.y > window.innerHeight - player.offsetHeight) {
        player_pos.y = window.innerHeight - player.offsetHeight;
    }

    player.style.left = player_pos.x + 'px';
    player.style.bottom = player_pos.y + 'px';

    checkCollisions();

    requestAnimationFrame(run);
}

function init() {
    createBushes()
    createBalls()
    run()
}

init()

// Handle movement using joystick for mobile view
if (window.innerWidth <= 800) {
    setInterval(handleJoystickMovement, 20);
}

// Event listener for modal hidden event
modal._element.addEventListener('hidden.bs.modal', () => {
    stopSound(walking);
    stopSound(battleSound);
});
modal._element.addEventListener('shown.bs.modal', () => {
    playSound(battleSound);
});

const keysPressed = new Set();

window.addEventListener('keydown', function (e) {
    keysPressed.add(e.key);

    // Check if modal is shown
    if (modal && modal._element.classList.contains('show')) {
        // If modal is shown, do not update player velocity
        player_vel.x = 0;
        player_vel.y = 0;
    } else {
        // Update player velocity based on pressed keys
        if (keysPressed.has("ArrowUp")) {
            player_vel.y = .75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_front.png")';
        }
        if (keysPressed.has("ArrowDown")) {
            player_vel.y = -.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_back.png")';
        }
        if (keysPressed.has("ArrowLeft")) {
            player_vel.x = -.75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_left.png")';
        }
        if (keysPressed.has("ArrowRight")) {
            player_vel.x = .75;
            player.style.backgroundImage = 'url("../assets/finder-files/player_right.png")';
        }

        player.classList.add('active');
    }
});

window.addEventListener('keyup', function (e) {
    keysPressed.delete(e.key);

    // Update player velocity based on remaining pressed keys
    if (!keysPressed.has("ArrowUp") && !keysPressed.has("ArrowDown")) {
        player_vel.y = 0;
    }
    if (!keysPressed.has("ArrowLeft") && !keysPressed.has("ArrowRight")) {
        player_vel.x = 0;
    }

    // Remove active class only if no keys are pressed
    if (keysPressed.size === 0) {
        player.classList.remove('active');
    }
});

window.addEventListener('resize', function () {
    // reload page
    location.reload();
});

let hulpModal = new bootstrap.Modal(document.getElementById('hulp'), {
    keyboard: false
});

window.onload = function () {
    if ((localStorage.getItem('hideHelp') === 'false') || (localStorage.getItem('hideHelp') === null)) {
        hulpModal.show();
    }
}

hideHelp.addEventListener('change', function () {
    localStorage.setItem('hideHelp', hideHelp.checked);
});