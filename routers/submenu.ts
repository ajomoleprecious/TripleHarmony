import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();
router.use(verifyUser);

router.get("/", async (req: Request, res: Response) => {
  try
  {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const pikaData = await response.json();
    const pikaUrl = await pikaData.sprites.other.showdown.front_default;

    res.render("pokemon-submenu", { pikaUrl });
  }
  catch (error: any)
  {
    res.status(404).json({ error: error.message });
  }
});


export default router;