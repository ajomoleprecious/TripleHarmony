import express from 'express';
import { userPokemon } from './middleware/currentPokemon';
import cookieParser from 'cookie-parser';
import { MongoClient, ObjectId } from 'mongodb';
import authRouter from './routers/auth';
import battlerPCRouter from './routers/battler_pc';
import battlerPVPRouter from './routers/battler_pvp';
import bekijkenRouter from './routers/bekijken';
import huidigeRouter from './routers/huidige';
import submenuRouter from './routers/submenu';
import trackerRouter from './routers/tracker';
import vangenRouter from './routers/vangen';
import vergelijkenRouter from './routers/vergelijken';
import whosThatRouter from "./routers/whos";
import dotenv from "dotenv";
const socketio = require('socket.io');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();
// Set up default mongoose connection
const uri = process.env.MONGODB_URI as string;
// Create a new MongoClient
export const client = new MongoClient(uri);
// Get the default connection
const app = express();
// Set the view engine for the app
app.set('view engine', 'ejs');
// Set the port for the app
app.set('port', process.env.PORT || 3000);
// Parse JSON bodies for this app
app.use(express.json({ limit: '1mb' }));
// Parse URL-encoded bodies for this app
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Parse cookies for this app
app.use(cookieParser());

const server = require('http').Server(app);
export const io = socketio(server);


// Use the routers
app.use('/pokemon-auth', authRouter);
app.use('/pokemon-battler-vs-pc', battlerPCRouter);
app.use('/pokemon-battler', battlerPVPRouter);
app.use('/pokemons-bekijken', bekijkenRouter);
app.use('/huidige-pokemon', huidigeRouter);
app.use('/pokemon-submenu', submenuRouter);
app.use('/pokemon-finder', trackerRouter);
app.use('/pokemons-vangen', vangenRouter);
app.use('/pokemon-vergelijken', vergelijkenRouter);
app.use(`/who's-that-pokemon`, whosThatRouter);

app.get('/', (req, res) => {
  if (req.cookies.jwt) {
    res.redirect('/pokemon-submenu');
  } else {
    res.render('index');
  }
});

/* Als route niet bestaat */
app.use((_, res) => {
  res.type('text/html');
  res.status(404).render('404');
});


// Exit the app
async function exit() {
  try {
    await client.close();
    console.log("\n\nDisconnected from database");
    process.exit(0);
  } catch (error) {
    console.error(error);
  }

}
export const pokemonsMaxEvolution: any[] = [];
// Start the app
async function startApp() {
  try {
    server.listen(app.get('port'), async () => {
      console.log('[server running on: http://localhost:' + server.address().port + ']');
    });
    await client.connect().then(() => {
      mongoose.connect(uri);
    }).then(async () => {
      console.log("Connected to MongoDB");
      // load data from db
      await client.db("users").collection("PokemonsMaxStages").find().toArray().then((data) => {
        pokemonsMaxEvolution.push(...data);
      });
      console.log("Pokemons Max levels loaded from db");
    }).catch((err: any) => {
      console.error('Error connecting to MongoDB:', err);
    });
    process.on('SIGINT', exit);
  } catch (error) {
    console.error(error);
  }
}

startApp();

let playersCount: number = 0;
let roomPlayers: { [roomId: string]: Set<string> } = {};
let playersPokemon: { [playerId: string]: any } = {};
let playersWaiting: { [playerId: string]: boolean } = {};

io.on('connection', (socket: any) => {
  playersCount++;
  io.emit('updatePlayerCount', playersCount);

  console.log(`New client connected: ${socket.id}`);
  console.log(`Total players: ${playersCount}`);

  // Store the player's Pokémon
  playersPokemon[socket.id] = userPokemon;

  // Handle join room
  socket.on('joinRoom', (roomId: string) => {
    if (roomPlayers[roomId] && roomPlayers[roomId].size === 2) {
      // Room is full
      io.to(socket.id).emit('roomFull');
      return;
    }
    // Store the player's Pokémon
    playersPokemon[socket.id] = userPokemon;
    socket.join(roomId);
    if (!roomPlayers[roomId]) {
      roomPlayers[roomId] = new Set();
    }
    roomPlayers[roomId].add(socket.id);
    io.to(roomId).emit('updateRoomPlayerCount', roomPlayers[roomId].size);

    console.log(`User joined room: ${roomId}`);
    console.log(`Total players in room ${roomId}: ${roomPlayers[roomId].size}`);
    console.log(`Player IDs in room ${roomId}: ${Array.from(roomPlayers[roomId]).join(', ')}`);

    if (roomPlayers[roomId].size === 2) {
      const [player1, player2] = Array.from(roomPlayers[roomId]);

      // Notify both players to start the game
      io.to(roomId).emit('startGame', player1, player2); // Pass the player IDs

      // Send Pokémon data to both players
      io.to(player1).emit('setPlayer1', playersPokemon[player1]);
      io.to(player1).emit('setPlayer2', playersPokemon[player2]);

      io.to(player2).emit('setPlayer1', playersPokemon[player2]);
      io.to(player2).emit('setPlayer2', playersPokemon[player1]);

      console.log(`Game started in room: ${roomId}`);
    }
  });
  const players: any = [];
  // Handle join random PvP
  socket.on('joinRandomPvP', () => {
    playersWaiting[socket.id] = true;
    console.log(`Players waiting for PvP: ${Object.keys(playersWaiting).join(', ')}`);

    // Check if we have enough players to start a game
    const waitingPlayers = Object.keys(playersWaiting).filter(playerId => playersWaiting[playerId]);
    if (waitingPlayers.length >= 2) {
      const [player1, player2] = waitingPlayers.slice(0, 2);
      console.log(`Matchmaking players: ${player1} and ${player2}`);
      players[0] = player1;
      players[1] = player2;
      // Remove matched players from the waiting list
      delete playersWaiting[player1];
      delete playersWaiting[player2];

      // Create a new room ID
      function generateRoomID() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let result = '';
        for (let i = 0; i < 5; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }

      const roomId = generateRoomID();
      // Add both players to the room
      roomPlayers[roomId] = new Set([player1, player2]);
      io.sockets.sockets.get(player1)?.join(roomId);
      io.sockets.sockets.get(player2)?.join(roomId);

      if (roomPlayers[roomId].size === 2) {
        const [player1, player2] = Array.from(roomPlayers[roomId]);

        // Notify both players to start the game
        io.to(roomId).emit('startGame', player1, player2); // Pass the player IDs

        // Send Pokémon data to both players
        io.to(player1).emit('setPlayer1', playersPokemon[player1]);
        io.to(player1).emit('setPlayer2', playersPokemon[player2]);

        io.to(player2).emit('setPlayer1', playersPokemon[player2]);
        io.to(player2).emit('setPlayer2', playersPokemon[player1]);

        console.log(`Game started in room: ${roomId}`);

        io.to(roomId).emit('readyToStart');
        
        let turn = 1; // Track whose turn it is

        socket.on('attack', (roomId: string, playerId: string, attack: number) => {
          if (turn === 1 && playerId === player1) {
            // Player 1's turn
            io.to(player2).emit('attackReceived', attack);
            turn = 2; // Switch to Player 2
          } else if (turn === 2 && playerId === player2) {
            // Player 2's turn
            io.to(player1).emit('attackReceived', attack);
            turn = 1; // Switch to Player 1
          }
          // Notify clients to update the turn
          io.to(roomId).emit('updateTurn', turn);
        });

      }
    }
  });

  // Handle player attack
  /*socket.on('attack', (roomId: string, player: number, attack: number) => {
    io.to(roomId).emit('attack', player, attack);
  });*/

  /*socket.on('attackPlayer1', () => {
    const [player1, player2] = Array.from(players);
    io.to(player1).emit('attackPlayer1');
    io.to(player2).emit('attackPlayer2');
  });

  socket.on('attackPlayer2', () => {
    const [player1, player2] = Array.from(players);
    io.to(player2).emit('attackPlayer1');
    io.to(player1).emit('attackPlayer2');
  });*/



  // Handle disconnection
  socket.on('disconnect', () => {
    for (const roomId in roomPlayers) {
      if (roomPlayers[roomId].has(socket.id)) {
        roomPlayers[roomId].delete(socket.id);
        if (roomPlayers[roomId].size === 0) {
          delete roomPlayers[roomId];
        }
        else if (roomPlayers[roomId].size === 1) {
          // Only one player left, delete the room
          delete roomPlayers[roomId];
          io.to(roomId).emit('playerDisconnected');
        }
        else {
          io.to(roomId).emit('updateRoomPlayerCount', roomPlayers[roomId].size);
        }
        console.log(`User left room: ${roomId}`);
        console.log(`Total players in room ${roomId}: ${roomPlayers[roomId]?.size || 0}`);
        if (roomPlayers[roomId]) {
          console.log(`Player IDs in room ${roomId}: ${Array.from(roomPlayers[roomId]).join(', ')}`);
        } else {
          console.log(`No players in room ${roomId}`);
        }

      }
    }
    playersCount--;
    io.emit('updatePlayerCount', playersCount);
    console.log(`Client disconnected: ${socket.id}`);
    console.log(`Total players: ${playersCount}`);
  });
});