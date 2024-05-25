import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentAvatar } from "../middleware/userAvatar";
import express from "express";
import { client } from "../index";
import { ObjectId } from "mongodb";
 
const router = Router();
router.use(verifyUser);
router.use(currentAvatar);

// Serve static files from the 'public' directory
router.use(express.static('public'));
 
router.get("/", async (req: Request, res: Response) => {
  try
  {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikaData = await response.json();
    const pikaUrl = await pikaData.sprites.other.showdown.front_default;
    let isEmpty = true;
    let usersPokemons = await client.db("users").collection("usersPokemons").findOne({ _id: res.locals.user._id });
    const avatar = res.locals.currentAvatar;

    if (usersPokemons && usersPokemons.pokemons.length > 0){
      isEmpty = false;
      res.render("pokemon-submenu", { pikaUrl, isEmpty, avatar});
    }
    else{
      isEmpty = true;
      res.render("pokemon-submenu", { pikaUrl, isEmpty, avatar});
    }
  }
  catch (error: any)
  {
    res.status(404).json({ error: error.message });
  }
});
 
router.post("/", async (req: Request, res: Response) => {
  // add pikachu to user's pokemon list
  const userID = res.locals.user._id;
  const pikachu = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
  const pikachuData = await pikachu.json();
  let pokemonList : any[] = [{ pokemonId : 25 , pokemonName : "pikachu", pokemonLevel : 1, pokemonHP : 35, pokemonAttack : 55, 
  pokemonDefense : 40, pokemonSpeed : 90, pokemonType : "electric", pokemonMoves : ["thundershock", "quick attack", "thunder wave", "thunderbolt"],
  pokemonImg : pikachuData.sprites.other["official-artwork"].front_default,
  pokemonGif : pikachuData.sprites.other["showdown"].front_default,
  pokemonBackImg : pikachuData.sprites.back_default,
  pokemonBackGif : pikachuData.sprites.other["showdown"].back_default }];
 
  try{
    await client.db("users").collection("usersPokemons").insertOne({ _id: userID, pokemons: pokemonList, currentPokemon: 25 });
    res.locals.pokemonID = 25;
    res.status(200).json({ message: "Pikachu is toegevoegd aan je lijst van pokemons." });
  }
  catch(error: any){
    return res.status(404).render("pokemon-auth-message", { title: "Error", message: "Er is iets fout gelopen met het toevoegen van pikachu naar je lijst van pokemons. Gelieve later opnieuw te proberen." });
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