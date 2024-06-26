import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import {Pokemon} from "../interfaces";
import express from "express";

const router = Router();
router.use(verifyUser);
router.use(currentPokemon);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

let userPokeArray: any[] = [];

router.get("/", async (req: Request, res: Response) => {
    userPokeArray = [];
    const avatar = res.locals.currentAvatar;
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    if (!user) return res.status(404).send("User not found");
    userPokeArray = user.pokemons;
    res.render("pokemons-vangen", { currentPokemon, avatar, userPokeArray });
});

router.post("/loslaten", async (req: Request, res: Response) => {
    let sendPokeName: string = req.body.sendPokeName; // Haal de naam van de te verwijderen Pokémon op uit het request body   
    try {
        // Haal de gebruiker op
        const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });

        if (!user || !user.pokemons || user.pokemons.length === 0) {
            return res.status(404).send("Geen Pokémon gevonden om te verwijderen.");
        }
        
        // check if user wants to delete current pokemon
        if (sendPokeName.toString().toLowerCase() === res.locals.currentPokemon.pokemonName.toString().toLowerCase()) {
            return res.status(400).render("error", { errorMessage: "Je kunt de huidige Pokémon niet verwijderen." });
        }

        if(userPokeArray.length !== 1) {
            for (let pokemon of userPokeArray) {
                if (pokemon.pokemonName.toString().toLowerCase() === sendPokeName.toString().toLowerCase()) {
                    const newPokemonsArray = userPokeArray.filter((poke: any) => poke.pokemonName.toString().toLowerCase() !== sendPokeName.toString().toLowerCase());
                    await client.db('users').collection('usersPokemons').updateOne({ _id: res.locals.user._id }, { $set: { pokemons: newPokemonsArray } });
                    break;
                }
            }
        }

        // Redirect naar "/pokemons-vangen" na het verwijderen
        res.redirect("/pokemons-vangen");
    } catch (err) {
        console.error("Fout bij verwijderen van Pokémon:", err);
        // Behandel de fout zoals nodig, bijvoorbeeld:
        res.status(500).render('error', { message: "Fout bij verwijderen van Pokémon" });
    }
});

router.post("/vangen", async (req: Request, res: Response) => {
    try {
        const killedPoke: string = req.body.killedPoke;
        const coughtPoke: any = await fetchPokemonByName(killedPoke);
        
        const addPoke = {
            pokemonId: coughtPoke.id,
            pokemonName: coughtPoke.name,
            pokemonLevel: 1,
            pokemonHP: coughtPoke.stats[0].base_stat,
            pokemonAttack: coughtPoke.stats[1].base_stat,
            pokemonDefense: coughtPoke.stats[2].base_stat,
            pokemonSpeed: coughtPoke.stats[5].base_stat,
            pokemonType: coughtPoke.types,
            pokemonMoves: coughtPoke.moves.splice(0, 4).map((move: any) => move.move.name),
            pokemonImg: coughtPoke.sprites.other["official-artwork"].front_default,
            pokemonGif: coughtPoke.sprites.other["showdown"].front_default,
            pokemonBackImg: coughtPoke.sprites.back_default,
            pokemonBackGif: coughtPoke.sprites.other["showdown"].back_default,
            nickname: "",
            caughtAt: new Date(),
            wins: 0,
            losses: 0
        };

        const pokemons = await client.db("users").collection("usersPokemons").findOne({ _id: res.locals.user._id }, { projection: { pokemons: 1 } });

        // check if user already has this pokemon
        if (pokemons && pokemons.pokemons.find((poke: any) => poke.pokemonName === addPoke.pokemonName)) {
            return res.status(400).render("error", { errorMessage: "Je hebt deze Pokémon al gevangen." });
        }
        
        await client.db("users").collection("usersPokemons").updateOne(
            { _id: res.locals.user._id },
            { $addToSet: { pokemons: { ...addPoke } } },
            { upsert: true }
        );
        
        res.redirect("/pokemons-vangen");
    }
    catch (error) {
        console.error(error);
        res.render("error", { errorMessage: "Fout bij het toevoegen van pokemon." });
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

router.post("/nickname", async (req: Request, res: Response) => {
    const { pokemonName, nickname } = req.body;
    try {
        const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
        if (!user) return res.status(404).send("User not found");

        const pokemon = user.pokemons.find((poke: Pokemon) => poke.pokemonName === pokemonName);
        if (pokemon) {
            pokemon.nickname = nickname;
            await client.db('users').collection('usersPokemons').updateOne(
                { _id: res.locals.user._id },
                { $set: { pokemons: user.pokemons } }
            );
            res.status(200).send("Nickname saved successfully");
        } else {
            res.status(404).send("Pokémon not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving nickname");
    }
});

async function fetchPokemonByName(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

export default router;