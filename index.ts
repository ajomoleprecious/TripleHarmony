import { log } from 'console';
import express from 'express';
import cookieParser from 'cookie-parser';
const mongoose = require('mongoose');
import { getPokeImages } from './functions';
import pokemonsBekijkenRouter from './routers/pokemons-bekijken';
import huidigePokemonRouter from './routers/huidige-pokemon';
import pokemonAuthRouter from './routers/pokemon-auth';
import whosThatPokemonRouter from "./routers/who's-that-pokemon";
const { verifyUser } = require('./middleware/verifyUser');

const uri = "mongodb+srv://DBManager:HmnVABk3hUo3zL9P@tripleharmony.9nn57t6.mongodb.net/";

const app = express();

let pokemonImages: any[] = [];

app.set('view engine', 'ejs');
app.set('port', 3000);

// Parse JSON bodies for this app
app.use(express.json());
// Parse URL-encoded bodies for this app
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(cookieParser());

app.use('/pokemons-bekijken', pokemonsBekijkenRouter, verifyUser);
app.use('/huidige-pokemon', huidigePokemonRouter, verifyUser);
app.use('/pokemon-auth', pokemonAuthRouter);
app.use(`/who's-that-pokemon`, whosThatPokemonRouter, verifyUser);


app.get('/', (req, res) => {
  res.render('index');
});


app.get("/pokemon-battler-vs-pc/:id", verifyUser, (req, res) => {
  const id = req.params.id;
  console.log(id);
  res.render('pokemon-battler-vs-pc');
});

app.get("/pokemon-battler", verifyUser, (req, res) => {
  res.render('pokemon-battler');
});

app.get('/pokemon-submenu', verifyUser, (req, res) => {
  res.locals.currentpokemonId = 25;
  res.render('pokemon-submenu');
});

app.get("/pokemons-vangen", verifyUser, async (req, res) => {

  let randomNumber: number = Math.floor(Math.random() * 898) + 1;

  res.render('pokemons-vangen');
});

app.get("/pokemon-vergelijken", verifyUser,  (req, res) => {
  res.render('pokemon-vergelijken');
});

app.get("/pokemon-finder", verifyUser,  (req, res) => {
  res.render("pokemon-finder");
});

app.get("/register-success", (req, res) => {
  res.render("register-success");
});

/* Als route niet bestaat */
app.use((_, res) => {
  res.type('text/html');
  res.status(404).render('404');
});

export const client = mongoose.connect(uri).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || app.get('port'), async () => {
    pokemonImages = await getPokeImages();

    console.log('[server] http://localhost:' + app.get('port'));
  });
}).catch((err : any) => {
  console.error('Error connecting to MongoDB:', err);
});
