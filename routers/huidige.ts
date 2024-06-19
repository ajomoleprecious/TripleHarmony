import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import {Pokemon} from "../interfaces";
import express from "express";
import { client } from "../index";

const router = Router();

router.use(verifyUser);
router.use(currentPokemon);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get('/', async (req: Request, res: Response) => {
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const pokemonsList = user?.pokemons;
    const avatar = res.locals.currentAvatar;
    const hasPreviousPage = false;
    const hasNextPage = false;
    const pageNumber = 1;
    res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList, hasPreviousPage, hasNextPage, pageNumber });
});

router.get("/filter", async (req: Request, res: Response) => {
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const pokemonsList = user?.pokemons;
    const avatar = res.locals.currentAvatar;
    const hasPreviousPage = false;
    const hasNextPage = false;
    const pageNumber = 1;

    const pokemonType = req.query.pokemon_type ? req.query.pokemon_type as string : "";
    const sortBy = req.query.sort_by ? req.query.sort_by as string : "";
    const pokemonName = req.query.pokemon_name ? req.query.pokemon_name as string : "";

    if (pokemonName !== "") {
        const filteredPokemons = pokemonsList.filter((pokemon: any) => pokemon.pokemonName.toString().toLowerCase() === pokemonName.toString().toLowerCase() || pokemon.nickname?.toString().toLowerCase() === pokemonName.toString().toLowerCase());
        res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList: filteredPokemons, hasPreviousPage, hasNextPage, pageNumber });
        return;
    }

    if (pokemonType !== "none") {
        const filteredPokemons = pokemonsList.filter((pokemon: any) => pokemon.pokemonType.some((type: any) => type.type.name.toString().toLowerCase() === pokemonType.toString().toLowerCase()));

        res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList: filteredPokemons, hasPreviousPage, hasNextPage, pageNumber });
        return;
    }

    if (sortBy === "name") {
        const sortedPokemons = pokemonsList.sort((a: any, b: any) => {
            if (a.pokemonName < b.pokemonName) return -1;
            if (a.pokemonName > b.pokemonName) return 1;
            return 0;
        });
        res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList: sortedPokemons, hasPreviousPage, hasNextPage, pageNumber });
        return;
    }
    else if (sortBy === "height") {
        const sortedPokemons = pokemonsList.sort((a: any, b: any) => {
            if (a.height < b.height) return -1;
            if (a.height > b.height) return 1;
            return 0;
        });
        res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList: sortedPokemons, hasPreviousPage, hasNextPage, pageNumber });
        return;
    }
    else if (sortBy === "weight") {
        const sortedPokemons = pokemonsList.sort((a: any, b: any) => {
            if (a.weight < b.weight) return -1;
            if (a.weight > b.weight) return 1;
            return 0;
        });
        res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList: sortedPokemons, hasPreviousPage, hasNextPage, pageNumber });
        return;
    }

    res.render('huidige-pokemon', { currentPokemon, avatar, pokemonsList, hasPreviousPage, hasNextPage, pageNumber });

});

router.get("/get-pokemon/:id", async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const currentPokemon = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === pokemonId);
    res.status(200).json(currentPokemon);
});

router.post("/save-nickname/:id", async (req: Request, res: Response) => {
    const pokemonId = parseInt(req.params.id);
    const { nickname } = req.body;
    
    try {
      const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
      if (!user) return res.status(404).send({ success: false, message: "User not found" });
  
      const pokemon = user.pokemons.find((poke: Pokemon) => poke.pokemonId === pokemonId);
      if (pokemon) {
        pokemon.nickname = nickname;
        await client.db('users').collection('usersPokemons').updateOne(
          { _id: res.locals.user._id },
          { $set: { pokemons: user.pokemons } }
        );
        res.status(200).send({ success: true, message: "Nickname saved successfully" });
      } else {
        res.status(404).send({ success: false, message: "Pokémon not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: false, message: "Error saving nickname" });
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

router.get("/changeCurrentPokemon/:id", async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    try {
        await client.db("users").collection("usersPokemons").updateOne({ _id: res.locals.user._id }, { $set: { currentPokemon: pokemonId } }, { upsert: true });
        res.status(200).redirect("/huidige-pokemon");
    }
    catch (err) {
        console.error(err);
    }
});

export default router;
