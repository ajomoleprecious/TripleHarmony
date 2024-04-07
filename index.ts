import { log } from 'console';
import express from 'express';
import axio from 'axios';
import { getPokeData } from './functions';

import { get } from 'http';

import { getLastPokemonFromChain, fetchPokemonByName } from './public/ts-scripts/bekijken';

let pokemons: any = [];


const app = express();
const axios = require('axios');

let pokemons: any[] = [];
let pokemonImages: any[] = [];

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

app.get("/pokemons-bekijken", async (req, res) => {
  let page = req.query.page ? Number(req.query.page) : 0;
  let amountOfPokemons = req.query.amountOfPokemons ? Number(req.query.amountOfPokemons) : 50;
  let offset = page * amountOfPokemons;
  let evolution_chain_ids : any[] = [];

  try {
    const pokemonsChainResponse = await axios.get(`https://pokeapi.co/api/v2/evolution-chain?offset=${offset}&limit=${amountOfPokemons}`);
    const pokemonsChain = pokemonsChainResponse.data;

    const pokemonPromises = pokemonsChain.results.map(async (item : any) => {
      let id : number = item.url.split('/')[6];
      evolution_chain_ids.push(id);
      let lastPokemon = await getLastPokemonFromChain(id);
      return fetchPokemonByName(lastPokemon);
    });

    const pokemonData = await Promise.all(pokemonPromises);
    console.log(evolution_chain_ids);
    res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, evolution_chain_ids });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/pokemons-vangen", async(req, res) => {
  let randomNumber: number = Math.floor(Math.random() * 898) + 1;

  res.render('pokemons-vangen', { randomNumber });
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
  pokemons = await getPokeData();
  console.log('[server] http://localhost:' + app.get('port'));
});