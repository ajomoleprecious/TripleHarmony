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
    try
    {
        let pikachu: any = await fetchPokemonByName("pikachu");
        let charmander: any = await fetchPokemonByName("charmander");
        const avatar = res.locals.currentAvatar;
        const currentPokemon = res.locals.currentPokemon;
        const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
        const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
        const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;
         // get left pokemon from params
        const leftPokemon = req.query.left_pokemon;
        // get right pokemon from params
        const rightPokemon = req.query.right_pokemon;

        // get left pokemon from database met fetchPokemonByName functie

        // get right pokemon from database met fetchPokemonByName functie
            res.render("pokemon-vergelijken", 
                { 
                    currentPokemon, pokemonHP, pokemonDefense, avatar, leftQuery: "", 
                    leftPokeImage: pikachu.sprites.other['official-artwork'].front_default, leftHP: pikachu.stats[0].base_stat, leftAttack: pikachu.stats[1].base_stat, leftDefense: pikachu.stats[2].base_stat,
                    rightPokeImage: charmander.sprites.other['official-artwork'].front_default, rightHP: charmander.stats[0].base_stat, rightAttack: charmander.stats[1].base_stat, rightDefense: charmander.stats[2].base_stat,
                });
    }
    catch (error) 
    {
        console.error(error);
        res.render("error", { errorMessage: "Fout bij het ophalen van pokemons" });;
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

// Function to fetch Pokémon data by name
async function fetchPokemonByName(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

export default router;