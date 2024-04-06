import { log } from 'console';
import express from 'express';
import { getPokemon } from './functions';
import { createPokemonList, fetchPokemonByName } from './public/ts-scripts/bekijken';

const app = express();

let pokemonsEvolution: any = [];
let pokemonsGif: any = [];
let pokemons : any = [];
let pokemonsID : number[] = [];



app.set('view engine', 'ejs');
app.set('port', 3000);

app.use(express.static('public'));

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
  let pageNumber = Number(req.query.page? req.query.page : 0) + 1;
  offset = Number(offset) * Number(req.query.amountOfPokemons? req.query.amountOfPokemons : 50);
  let response = await 
  fetch(`https://pokeapi.co/api/v2/evolution-chain?limit=${req.query.amountOfPokemons ? req.query.amountOfPokemons : 50}&offset=${offset}`);
  pokemonsEvolution = await response.json();
  pokemonsGif = [];
  pokemons = [];
  for (let i = 0; i < pokemonsEvolution.results.length; i++) {
    let pokemonId = pokemonsEvolution.results[i].url.split('/');
    await createPokemonList(pokemonId[6]).then((pokemonName) => {
      pokemons.push(pokemonName);
      pokemonsID.push(pokemonId[6]);
    });
  }
  pokemons = pokemons.flat();
  for (let i = 0; i < pokemons.length; i++) {
    const pokemonData : any = await fetchPokemonByName(pokemons[i]);
    await fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonsID[i]}.gif`)
    .then(response => {
      if (response.ok) {
        pokemonsGif.push(pokemonData.sprites.other['showdown'].front_default);
      }
    })
  }
  console.log(pokemonsGif);
  res.render('pokemons-bekijken', { 
    pokemons: pokemons,
    pokemonsGif: pokemonsGif,
    pageNumber: pageNumber,
    pokemonsID: pokemonsID
  });
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