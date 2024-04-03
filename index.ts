import { log } from 'console';
import express from 'express';
import { getPokemon } from './functions';

const app = express();

let pokemons: any = [];
let pokemonsImg: any = [];



app.set('view engine', 'ejs');
app.set('port', 3000);

app.use(express.static('public'));
getPokemon('https://pokeapi.co/api/v2/pokemon').then(data => {
  pokemons = data;
});
app.get('/', (req, res) => {
  res.render('index');
});

app.get("/huidige-pokemon", (req, res) => {
  res.render('huidige-pokemon');
});

app.get('/pokemon-auth', (req, res) => {
  res.render('pokemon-auth');
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

app.get("/pokemons-bekijken", async(req, res) => { 
  let offset = req.query.page? req.query.page : 0;
  offset = Number(offset) * Number(req.query.amountOfPokemons? req.query.amountOfPokemons : 50);
  let response = await 
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${req.query.amountOfPokemons ? req.query.amountOfPokemons : 50}&offset=${offset}`);
  pokemons = await response.json();
  pokemonsImg = [];
  for (let i = 0; i < pokemons.results.length; i++) {
    let pokemonId = pokemons.results[i].url.split('/');
    pokemonsImg.push(pokemonId[6]);
  }
  res.render('pokemons-bekijken', { pokemons: pokemons.results, pokemonsImg: pokemonsImg });
});

app.get("/pokemons-vangen", (req, res) => {
  res.render('pokemons-vangen');
});

app.get("/pokemon-vergelijken", (req, res) => {
  res.render('pokemon-vergelijken');
});

app.get("/result-who's-that-pokemon", (req, res) => {
  res.render("result-who's-that-pokemon");
});

app.get("/who's-that-pokemon", (req, res) => {
  res.render("who's-that-pokemon");
});

app.get("/pokemon-finder", (req, res) => {
  res.render("pokemon-finder");
});

/* Als route niet bestaat */
app.use((_, res) => {
  res.type('text/html');
  res.status(404);
  res.sendFile('./views/404.html', { root: __dirname });
});

app.listen(app.get('port'), async () => {
  console.log('[server] http://localhost:' + app.get('port'));
});