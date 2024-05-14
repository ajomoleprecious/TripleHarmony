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

router.get("/", async (req: Request, res: Response) => {
    const avatar = res.locals.currentAvatar;
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    res.render("pokemons-vangen", { currentPokemon, avatar});
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