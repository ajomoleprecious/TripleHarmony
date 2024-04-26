import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import axios from "axios";
import express from "express";

const router = Router();
router.use(verifyUser);
// Serve static files from the 'public' directory
router.use(express.static('public'));

// Function to fetch a random Pokémon
async function getRandomPokemon() {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const pokemonList = response.data.results;
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    return randomPokemon;
}

router.get('/', async (req: Request, res: Response) => {
    let randomPokemon = await getRandomPokemon();
    res.render('who\'s-that-pokemon', { name: randomPokemon.name, image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.url.split("/")[6]}.png` });
});


router.get('/new-pokemon', async (req: Request, res: Response) => {
    let randomPokemon = await getRandomPokemon();
    res.json({ name: randomPokemon.name, image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.url.split("/")[6]}.png` });
});

export default router;