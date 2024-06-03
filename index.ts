import express from 'express';

import { Request, Response, NextFunction } from "express";
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
      console.log('[server running on: http://localhost:' + app.get('port') + ']');
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

io.on('connection', (socket: any) => {
  playersCount++;
  io.emit('updatePlayerCount', playersCount);

  console.log(`New client connected: ${socket.id}`);
  console.log(`Total players: ${playersCount}`);

  // Handle join room
  socket.on('joinRoom', (roomId: string) => {
    if (roomPlayers[roomId] && roomPlayers[roomId].size === 2) {
      // room is full
      io.to(socket.id).emit('roomFull');
      return;
    }
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
      io.to(roomId).emit('startGame');
      console.log(`Game started in room: ${roomId}`);
    }
  });

  // Handle leave room
  socket.on('leaveRoom', (roomId: string) => {
    socket.leave(roomId);
    if (roomPlayers[roomId]) {
      roomPlayers[roomId].delete(socket.id);
      if (roomPlayers[roomId].size === 0) {
        delete roomPlayers[roomId];
      } else {
        io.to(roomId).emit('updateRoomPlayerCount', roomPlayers[roomId].size);
      }
    }

    console.log(`User left room: ${roomId}`);
    console.log(`Total players in room ${roomId}: ${roomPlayers[roomId] ? roomPlayers[roomId].size : 0}`);
    if (roomPlayers[roomId]) {
      console.log(`Player IDs in room ${roomId}: ${Array.from(roomPlayers[roomId]).join(', ')}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    playersCount--;
    io.emit('updatePlayerCount', playersCount);

    for (const roomId in socket.rooms) {
      if (socket.rooms.hasOwnProperty(roomId) && roomPlayers[roomId]) {
        roomPlayers[roomId].delete(socket.id);
        if (roomPlayers[roomId].size === 0) {
          delete roomPlayers[roomId];
        } else {
          io.to(roomId).emit('updateRoomPlayerCount', roomPlayers[roomId].size);
        }
        console.log(`Total players in room ${roomId}: ${roomPlayers[roomId] ? roomPlayers[roomId].size : 0}`);
        if (roomPlayers[roomId]) {
          console.log(`Player IDs in room ${roomId}: ${Array.from(roomPlayers[roomId]).join(', ')}`);
        }
      }
    }

    console.log(`Client disconnected: ${socket.id}`);
    console.log(`Total players: ${playersCount}`);
  });
});


