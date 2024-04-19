import { log } from 'console';
import express from 'express';
import { MongoClient } from "mongodb";
import { getPokeImages } from './functions';
import pokemonsBekijkenRouter from './routers/pokemons-bekijken';
import huidigePokemonRouter from './routers/huidige-pokemon';
import pokemonAuthRouter from './routers/pokemon-auth';
import whosThatPokemonRouter from "./routers/who's-that-pokemon";

const uri = "mongodb+srv://DBManager:HmnVABk3hUo3zL9P@tripleharmony.9nn57t6.mongodb.net/";
export const client = new MongoClient(uri);


const app = express();

let pokemonImages: any[] = [];

app.set('view engine', 'ejs');
app.set('port', 3000);

// Parse JSON bodies for this app
app.use(express.json());
// Parse URL-encoded bodies for this app
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/pokemons-bekijken', pokemonsBekijkenRouter);
app.use('/huidige-pokemon', huidigePokemonRouter);
app.use('/pokemon-auth', pokemonAuthRouter);
app.use(`/who's-that-pokemon`, whosThatPokemonRouter);


app.get('/', (req, res) => {
  res.render('index');
});


app.get("/pokemon-battler-vs-pc", (req, res) => {
  res.render('pokemon-battler-vs-pc');
});

app.get("/pokemon-battler", (req, res) => {
  res.render('pokemon-battler');
});

app.get('/pokemon-submenu', (req, res) => {
  res.render('pokemon-submenu');
});

app.get("/pokemons-vangen", async(req, res) => {

  let randomNumber: number = Math.floor(Math.random() * 898) + 1;
  
  res.render('pokemons-vangen');
});

app.get("/pokemon-vergelijken", (req, res) => {
  res.render('pokemon-vergelijken');
});

app.get("/pokemon-finder", (req, res) => {
  res.render("pokemon-finder");
});

/* Als route niet bestaat */
app.use((_, res) => {
  res.type('text/html');
  res.status(404).render('404');
});

app.listen(process.env.PORT || app.get('port'), async () => {
  pokemonImages = await getPokeImages();
  await client.connect();
  console.log('[server] http://localhost:' + app.get('port'));
});