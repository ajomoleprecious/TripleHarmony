import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import express from "express";
import { client } from "..";

const router = Router();

router.use(verifyUser);
router.use(currentPokemon);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get('/', async (req: Request, res: Response) => {
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
    const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;
    const pokemonsList = user?.pokemons;
    const avatar = res.locals.currentAvatar;
    res.render('huidige-pokemon', {currentPokemon, pokemonHP, pokemonDefense, avatar, pokemonsList});
});

router.get("/get-pokemon/:id", async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const currentPokemon = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === pokemonId);
    res.status(200).json(currentPokemon);
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

router.post("/changeCurrentPokemon/:id", async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    try {
        await client.db("users").collection("usersPokemons").updateOne({ _id: res.locals.user._id }, { $set: { currentPokemon: pokemonId } }, { upsert: true });
        res.status(200).json({ message: "Pokemon is succesvol gewijzigd." });
    }
    catch (err) {
        console.error(err);
    }
});

export default router;
