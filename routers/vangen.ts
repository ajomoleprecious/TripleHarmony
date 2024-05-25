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
    let sendPokeName: string | undefined = req.body.sendPokeName; // Haal de naam van de te verwijderen Pokémon op uit het request body   
    console.log(sendPokeName);
    try {
        // Haal de gebruiker op
        const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });

        if (!user || !user.pokemons || user.pokemons.length === 0) {
            return res.status(404).send("Geen Pokémon gevonden om te verwijderen.");
        }

        for(let pokemon of userPokeArray)
            {
                if(pokemon.pokemonName === sendPokeName)
                {
                    console.log(pokemon.pokemonName);
                    const newPokemonsArray = userPokeArray.filter((poke: any) => poke.pokemonName !== sendPokeName);
                    await client.db('users').collection('usersPokemons').updateOne({ _id: res.locals.user._id }, { $set: { pokemons: newPokemonsArray }});
                    break;
                }
            }

        // Redirect naar "/pokemons-vangen" na het verwijderen
        res.redirect("/pokemons-vangen");
    } catch (err) {
        console.error("Fout bij verwijderen van Pokémon:", err);
        // Behandel de fout zoals nodig, bijvoorbeeld:
        res.status(500).send("Er is een fout opgetreden bij het verwijderen van de Pokémon.");
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