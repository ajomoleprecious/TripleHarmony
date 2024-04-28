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
  res.render("pokemon-battler-vs-pc", { avatar });
});

router.get("/:pokemonToBattle", async (req: Request, res: Response) => {
  const avatar = res.locals.currentAvatar;
  const pokemonToBattle = req.params.pokemonToBattle;
  try {
    res.status(200).render("pokemon-battler-vs-pc", { pokemonToBattle, avatar });
  }
  catch (error: any) {
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