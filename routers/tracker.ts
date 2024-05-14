import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import axios from "axios";
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
        
        const pokemonID = Math.floor(Math.random() * 1025) + 1;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);

        // Check if the response is ok before parsing the JSON
        if (response.status !== 200) {
            res.redirect("/random-pokemon");
            return;
        }
        const pokeData = response.data;

        const pokeNaam = pokeData.name;
        const pokeURL = pokeData.sprites.other["official-artwork"].front_default;
        res.status(200).json({ pokeURL, pokemonID, pokeNaam: pokeNaam.charAt(0).toUpperCase() + pokeNaam.slice(1) });

    }
    catch (error: any) {
        // Return a 500 status code for internal server errors
        res.status(500).json({ error: error.message });
    }
});

export default router;