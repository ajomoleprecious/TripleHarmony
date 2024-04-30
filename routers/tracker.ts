import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import express from "express";

const router = Router();
router.use(verifyUser);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get("/", (req: Request, res: Response) => {
    const avatar = res.locals.currentAvatar;
    res.render("pokemon-finder", { avatar });
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

router.get("/random-pokemon", async (req: Request, res: Response) => {
    try {
        let pokeURL;
        const pokemonID = Math.floor(Math.random() * 1025) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        const pokeData = await response.json();
        if (await pokeData.sprites.other['showdown'] === null) {
            pokeURL = await pokeData.sprites.other['official-artwork'].front_default;
        }
        else {
            pokeURL = await pokeData.sprites.other['showdown'].front_default;
        }
        const pokeNaam = await pokeData.name;
        res.status(200).json({ pokeURL, pokemonID, pokeNaam: pokeNaam.charAt(0).toUpperCase() + pokeNaam.slice(1) });
    }
    catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

export default router;