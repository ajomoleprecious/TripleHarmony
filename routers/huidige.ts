import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import express from "express";

const router = Router();

router.use(verifyUser);
router.use(currentPokemon);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get('/', async (req: Request, res: Response) => {
    const currentPokemon = res.locals.currentPokemon;
    const pokemonHP = currentPokemon.stats.find((stat: any) => stat.stat.name === 'hp').base_stat;
    const pokemonDefense = currentPokemon.stats.find((stat: any) => stat.stat.name === 'defense').base_stat;
    res.render('huidige-pokemon', {currentPokemon, pokemonHP, pokemonDefense}); // Make sure 'huidige-pokemon' is a valid view file
});

export default router;
