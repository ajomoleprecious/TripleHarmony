import express from 'express';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';
import authRouter from './routers/auth';
import battlerPCRouter from './routers/battler_pc';
import battlerPVPRouter from './routers/battler_pvp';
import bekijkenRouter from './routers/bekijken';
import huidigeRouter from './routers/huidige';
import submenuRouter from './routers/submenu';
import trackerRouter from './routers/tracker';
import vangenRouter from './routers/vangen';
import vergelijkenRouter from './routers/vergelijken';
import whosThatRouter from "./routers/who's";
import dotenv from "dotenv";
import { Server } from 'socket.io';
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
app.use(express.json());
// Parse URL-encoded bodies for this app
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Parse cookies for this app
app.use(cookieParser());

const server = require('http').Server(app);
const io = new Server(server);


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
  res.render('index');
});

app.get("/register-success", (req, res) => {
  res.render("register-success");
});

/* Als route niet bestaat */
app.use((_, res) => {
  res.type('text/html');
  res.status(404).render('404');
});

// Start the app
client.connect()
  .then(() => {
    mongoose.connect(uri);
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(app.get('port'), async () => {
      console.log('[server running on: http://localhost:' + app.get('port') + ']');
    });
  }).catch((err: any) => {
    console.error('Error connecting to MongoDB:', err);
  });

io.on('connection', (socket: any) => {
  console.log('User connected: ' + socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export { io };