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

/*import express from 'express';
const app = express();

let players = [];

import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        if (players.length < 2) {
            players.push(socket.id);
        }
        console.log(players);
        if (players.length === 2) {
            io.emit('startGame');
        }
    });
    console.log('a user connected');
});

const socket = io();

socket.emit('message', 'Hello World');*/


