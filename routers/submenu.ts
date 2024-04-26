import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { client } from "../index";
import { ObjectId } from "mongodb";
import { title } from "process";
 
const router = Router();
router.use(verifyUser);
 
router.get("/", async (req: Request, res: Response) => {
  try
  {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikaData = await response.json();
    const pikaUrl = await pikaData.sprites.other.showdown.front_default;
    let isEmpty = true;
    let usersPokemons = await client.db("users").collection("usersPokemons").findOne({ _id: res.locals.user._id })
    if (usersPokemons && usersPokemons.pokemons.length > 0){
      isEmpty = false;
      res.render("pokemon-submenu", { pikaUrl, isEmpty });
    }
    else{
      isEmpty = true;
      res.render("pokemon-submenu", { pikaUrl, isEmpty });
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
  let pokemonList : any[] = [{ pokemonId : 25 }];
 
  try{
    await client.db("users").collection("usersPokemons").insertOne({ _id: new ObjectId(userID), pokemons: pokemonList, currentPokemon: 25});
    res.locals.pokemonID = 25;
    res.status(200).json({ message: "Pikachu is toegevoegd aan je lijst van pokemons." });
  }
  catch(error: any){
    return res.status(404).render("pokemon-auth-message", { title: "Error", message: "Er is iets fout gelopen met het toevoegen van pikachu naar je lijst van pokemons. Gelieve later opnieuw te proberen." });
  }
 
});
 
 
export default router;