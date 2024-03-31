import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('port', 3000);

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get("pokemon-pages/huidige-pokemon", (req, res) => {
  res.render('huidige-pokemon');
});

app.get("/pokemon_pages/pokemon-auth", (req, res) => {
  res.render('pokemon-auth');
});

app.get("/pokemon_pages/pokemon-battler-vs-pc", (req, res) => {
  res.render('pokemon-battler-vs-pc');
});

app.get("/pokemon_pages/pokemon-battler", (req, res) => {
  res.render('pokemon-battler');
});

app.get("/pokemon_pages/pokemon-submenu", (req, res) => {
  res.render('pokemon-submenu');
});

app.get("/pokemon_pages/pokemons-bekijken", (req, res) => {
  res.render('pokemons-bekijken');
});

app.get("/pokemon_pages/pokemons-vangen", (req, res) => {
  res.render('pokemons-vangen');
});

app.get("/pokemon_pages/result-who's-that-pokemon", (req, res) => {
  res.render("result-who's-that-pokemon");
});

app.get("/pokemon_pages/who's-that-pokemon", (req, res) => {
  res.render("who's-that-pokemon");
});

app.listen(app.get('port'), async () => {
  console.log( '[server] http://localhost:' + app.get('port'));
});