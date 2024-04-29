import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import express from "express";

const router = Router();
router.use(verifyUser);
router.use(currentPokemon);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

let pokemonArray: any[] = [];

router.get("/", async (req: Request, res: Response) => {
    fetchPokemons();
    const avatar = res.locals.currentAvatar;
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
    const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;

    // get left pokemon from params
    const leftPokemon = req.query.left_pokemon;
    // get right pokemon from params
    const rightPokemon = req.query.right_pokemon;

    // get left pokemon from database

    // get right pokemon from database
    res.render("pokemon-vergelijken", { currentPokemon, pokemonHP, pokemonDefense, avatar });
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

async function fetchPokemons()
{
    try 
    {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const pokemons = data.results;
        
        // Loop door de lijst met Pokémon en voeg ze toe aan de array
        pokemons.forEach(async (pokemon: any) => {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();
            pokemonArray.push(pokemonDetails);
        });
    }
    catch (error) 
    {
        console.error('Er is een fout opgetreden bij het ophalen van de Pokémon:', error);
    }
}

export default router;