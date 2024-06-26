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
    if (pokemonToBattleData.sprites.other["showdown"].front_default) {
      pokemonImg = pokemonToBattleData.sprites.other["showdown"].front_default;
    }
    else {
      pokemonImg = pokemonToBattleData.sprites.other["official-artwork"].front_default;
    }
    res.status(200).render("pokemon-battler-vs-pc", { pokemonToBattleData, pokemonImg, currentPokemon, avatar });
  }
  catch {
    res.status(404).render("error", { errorMessage: "Er was een error opgetreden bij het ophalen van een pokemon gegevens." });
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

router.post("/updateWins", async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user._id;
    const pokemonId = res.locals.currentPokemon.pokemonId;

    // Step 1: Check if the 'wins' field exists for the specific pokemonId
    const userDocument = await client.db("users").collection("usersPokemons").findOne(
      { _id: userId, "pokemons.pokemonId": pokemonId, "pokemons.wins": { $exists: true } },
      { projection: { _id: 1 } }  // Only need to project the _id, as the existence check is sufficient
    );

    if (userDocument) {
      // Step 2a: If 'wins' exists, increment it
      await client.db("users").collection("usersPokemons").updateOne(
        { _id: userId, "pokemons.pokemonId": pokemonId },
        { $inc: { "pokemons.$.wins": 1 } }
      );
    } else {
      // Step 2b: If 'wins' does not exist, add the 'wins' field and set it to 1
      await client.db("users").collection("usersPokemons").updateOne(
        { _id: userId, "pokemons.pokemonId": pokemonId },
        { $set: { "pokemons.$[elem].wins": 1 } },
        { arrayFilters: [{ "elem.pokemonId": pokemonId }] }
      );
    }

    res.status(200).json({ message: "Wins updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating wins" });
  }
});

router.post("/updateLosses", async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user._id;
    const pokemonName = res.locals.currentPokemon.pokemonName;

    // Log input values for debugging
    console.log(`Updating losses for user ${userId} and pokemon ${pokemonName}`);

    // Step 1: Check if the 'losses' field exists for the specified pokemonName
    const userDocument = await client.db("users").collection("usersPokemons").findOne(
      { _id: userId, "pokemons.pokemonName": pokemonName, "pokemons.losses": { $exists: true } },
      { projection: { "pokemons.$": 1 } }
    );

    if (userDocument && userDocument.pokemons && userDocument.pokemons[0]) {
      // Step 2a: If 'losses' exists, increment it
      await client.db("users").collection("usersPokemons").updateOne(
        { _id: userId, "pokemons.pokemonName": pokemonName },
        { $inc: { "pokemons.$.losses": 1 } }
      );
    } else {
      // Step 2b: If 'losses' does not exist, set it to 1
      await client.db("users").collection("usersPokemons").updateOne(
        { _id: userId, "pokemons.pokemonName": pokemonName, "pokemons.losses": { $exists: false } },
        { $set: { "pokemons.$[elem].losses": 1 } },
        { arrayFilters: [{ "elem.pokemonName": pokemonName }] }
      );
    }

    res.status(200).json({ message: "Losses updated successfully" });
  } catch (err) {
    console.error("Error updating losses:", err);
    res.status(500).json({ message: "Error updating losses" });
  }
});

async function fetchPokemonByName(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data;
}

router.post("/vangen", async (req: Request, res: Response) => {
  try {
    const pokemonName = req.body.pokemonName;
    const coughtPoke: any = await fetchPokemonByName(pokemonName);
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

export default router;