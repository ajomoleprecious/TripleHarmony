import { Request, Response, NextFunction } from "express";

export function trackIfFought (req: Request, res: Response, next: NextFunction) {
    if(res.locals.pokemonToBattle !== ""  ) { 

    }
    else {
        res.redirect("/pokemons-vangen");
    }
}