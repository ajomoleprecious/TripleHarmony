import { Request, Response, Router } from "express";
import axios from "axios";
import { get } from "http";

const router = Router();

// Function to fetch a random Pokémon
async function getRandomPokemon() {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const pokemonList = response.data.results;
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    console.log(randomPokemon);
    return randomPokemon;
}

router.get('/', async (req: Request, res: Response) => {
    await getRandomPokemon();
    res.render('who\'s-that-pokemon');
});


export default router;



