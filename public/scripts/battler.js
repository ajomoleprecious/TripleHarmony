let pokemonTofight = document.querySelector(".battlefield article:nth-child(2) img");
let fightButtons = document.querySelectorAll(".aanvallen li");
let punchAnim = document.querySelector(".pokemon-damage img:nth-child(2)");

fightButtons.forEach((button) => {
    button.addEventListener("click", () => {
        punchAnim.style.display = "block";
        pokemonTofight.style.animation = "damage .5s";
        pokemonTofight.style.animationdelay = "1s";
        setTimeout(() => {
            punchAnim.style.display = "none";
        }, 1000);
        setTimeout(() => {
            pokemonTofight.style.animation = "none";
        }, 1500);
    });
});

let choiceModal = new bootstrap.Modal(document.getElementById('battleChoice'), {
    keyboard: false,
    backdrop: 'static'
});

choiceModal.show();

const players = document.getElementById('players');
let playersNumbers = 0;

const socket = io();
/* check connection */
socket.on('playerCount', (count) => {
    // Update the number of players
    players.innerHTML = count;
});


const linkInputgroup = document.getElementById('linkInputgroup');
const linkInput = document.getElementById('linkInput');
const small = document.querySelector('#pvpfriend small');
const waitP = document.querySelector('#pvpfriend p');
const waitImg = document.querySelector('#pvpfriend img');

linkInputgroup.addEventListener('click', () => {
    linkInputgroup.style.border = "3px solid green";
    linkInputgroup.style.borderRadius = "10px";
    small.style.display = "block";
    waitP.style.display = "block";
    waitImg.style.display = "block";
    // Copy the link to the clipboard
    linkInput.select();
    document.execCommand("copy");
});