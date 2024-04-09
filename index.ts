import { log } from 'console';
import express from 'express';
import { getPokemon } from './functions';
import pokemonsBekijkenRouter from './routers/pokemons-bekijken';
import huidigePokemonRouter from './routers/huidige-pokemon';
import { get } from 'http';

let pokemons: any = [];

const app = express();


app.set('view engine', 'ejs');
app.set('port', 10000);

app.use(express.static('public'));
app.use('/pokemons-bekijken', pokemonsBekijkenRouter);
app.use('/huidige-pokemon', huidigePokemonRouter);


app.get('/', (req, res) => {
  res.render('index');
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

app.get("/pokemons-vangen", (req, res) => {
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
  await getPokemon(pokemons);
  console.log('[server] http://localhost:' + app.get('port'));
});