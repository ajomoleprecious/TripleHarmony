import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentAvatar } from "../middleware/userAvatar";
import { currentPokemon } from "../middleware/currentPokemon";
import { client } from "../index";
import express from "express";
import axios from "axios";

const router = Router();
router.use(verifyUser);
router.use(currentAvatar);
router.use(currentPokemon);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get("/", (req: Request, res: Response) => {
  const avatar = res.locals.currentAvatar;
  res.render("pokemon-battler-vs-pc", { avatar });
});

router.get("/:pokemonToBattle", async (req: Request, res: Response) => {
  const avatar = res.locals.currentAvatar;
  const currentPokemon = res.locals.currentPokemon;
  res.locals.pokemonToBattle = req.params.pokemonToBattle;
  try {
    const pokemonToBattle = req.params.pokemonToBattle;
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonToBattle}`);
    const pokemonData = await pokemonResponse.json();
    const pokemonToBattleData = pokemonData;
    let pokemonImg;
    if(pokemonToBattleData.sprites.other["showdown"].front_default){
      pokemonImg = pokemonToBattleData.sprites.other["showdown"].front_default;
    }
    else{
      pokemonImg = pokemonToBattleData.sprites.other["official-artwork"].front_default;
    }
    res.status(200).render("pokemon-battler-vs-pc", { pokemonToBattleData, pokemonImg, currentPokemon, avatar });
  }
  catch{
    res.status(404).render("error", {errorMessage : "Er was een error opgetreden bij het ophalen van een pokemon gegevens."});
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