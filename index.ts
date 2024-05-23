import express from 'express';
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

app.get("/register-success", (req, res) => {
  res.render("register-success");
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
export const pokemonsMaxEvolution : any[] = [];
// Start the app
async function startApp() {
  try {
    await client.connect().then(() => {
      mongoose.connect(uri);     
    }).then(async () => {
      console.log("Connected to MongoDB");
      // load data from db
      await client.db("users").collection("PokemonsMaxStages").find().toArray().then((data) => {
        pokemonsMaxEvolution.push(...data);
      });
      // find duplicates in data list data by field id and log them
      /*let duplicates = data.reduce((acc: any, current: any) => {
        if (acc[current.id]) {
          acc[current.id]++;
        } else {
          acc[current.id] = 1;
        }
        return acc;
      }, {});
      console.log(duplicates);*/

      server.listen(app.get('port'), async () => {
        console.log('[server running on: http://localhost:' + app.get('port') + ']');
      });
    }).catch((err: any) => {
      console.error('Error connecting to MongoDB:', err);
    });

    process.on('SIGINT', exit);
  } catch (error) {
    console.error(error);
  }
}

startApp();

interface Player {
  id: string;
  waiting: boolean;
}

let players: any[] = [];


let playersCount: number = 0;

io.on('connection', (socket: any) => {
  players.push(socket.id);
  console.log(players);
  playersCount++;
  io.emit('updatePlayerCount', playersCount);

  // Handle disconnection
  socket.on('disconnect', () => {
    players.splice(players.indexOf(socket.id), 1);
    console.log(players);
    playersCount--;
    io.emit('updatePlayerCount', playersCount);
  });
});

/*io.on('connection', (socket: any) => {
  socket.on('playerReady', (id: string) => {
    const player = players.find(player => player.id === id);
    if (player) {
      player.waiting = true;
    } else {
      players.push({ id, waiting: true });
    }

    const readyPlayers = players.filter(player => player.waiting);
    if (readyPlayers.length === 2) {
      readyPlayers.forEach(player => {
        io.to(player.id).emit('startGame');
      });
      players = players.filter(player => !player.waiting);
    }
  });

  socket.on('playerMove', (id: string, move: string) => {
    socket.to(id).emit('opponentMove', move);
  });
});*/