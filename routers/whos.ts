import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import axios from "axios";
import express from "express";
 
const router = Router();
router.use(verifyUser);
router.use(currentPokemon);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));
 
// Function to fetch a random Pokémon
async function getRandomPokemon() {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=386");
    const pokemonList = response.data.results;
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    return randomPokemon;
}
 
router.get('/', async (req: Request, res: Response) => {
    const avatar = res.locals.currentAvatar;
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    let randomPokemon = await getRandomPokemon();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.url.split("/")[6]}.png`;
    res.render('whos-that-pokemon', { name: randomPokemon.name, image: imageUrl, currentPokemon, avatar});
});
 
router.get('/new-pokemon', async (req: Request, res: Response) => {
    let randomPokemon = await getRandomPokemon();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.url.split("/")[6]}.png`;

    res.json({ name: randomPokemon.name, image: imageUrl });
});

router.post("/award/:type/:points", async (req, res) => {
    const type = req.params.type;
    const points = parseInt(req.params.points);
    const pokemonId = parseInt(req.body.currentPokemon);
  
    if (type === "aanval") {
      if (points > 0) {
        await client.db("users").collection("usersPokemons").updateMany(
          { _id: res.locals.user._id, pokemons: { $elemMatch: { pokemonId } } },
          { $inc: { "pokemons.$.pokemonAttack": points } }
        );
        res.status(200).json({ message: "Aanval is succesvol gewijzigd." });
      }
      return;
    }
    if (type === "defense") {
      if (points > 0) {
        await client.db("users").collection("usersPokemons").updateMany(
          { _id: res.locals.user._id, pokemons: { $elemMatch: { pokemonId } } },
          { $inc: { "pokemons.$.pokemonDefense": points } }
        );
        res.status(200).json({ message: "Defense is succesvol gewijzigd." });
      }
      return;
    }
  });

router.post("/change-avatar/:avatar", async (req, res) => {
    res.locals.avatar = req.params.avatar;
    try {
        await client.db("users").collection("usersAvatars").updateOne({ _id: res.locals.user._id }, { $set: { avatar: res.locals.avatar } }, { upsert: true });
        res.status(200).json({ message: "Avatar is succesvol gewijzigd." });
    }
    catch (err) {
        console.error(err);
    }
});
export default router;