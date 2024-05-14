import { Request, Response, NextFunction } from "express";
import { client } from "../index";
import axios from "axios";


export const currentPokemon = async (req: Request, res: Response, next: NextFunction) => {
    let pokemonID = res.locals.pokemonID || null;

    if (pokemonID === null) {
        const userPokemon = await client.db("users").collection("usersPokemons").findOne({ _id: res.locals.user._id }, { projection: { currentPokemon: 1 } });
        pokemonID = userPokemon ? userPokemon.currentPokemon : null;
    }

    if (pokemonID) {
        try {
            const pokemonResponse = await client.db("users").collection("usersPokemons").findOne({ _id: res.locals.user._id }, { projection: { pokemons: 1 } });
            const pokemons = pokemonResponse?.pokemons; // pokemons is an array of objects
            const currentPokemon = pokemons.find((pokemon: any) => pokemon.pokemonId === pokemonID);
            res.locals.currentPokemon = currentPokemon;
        } catch (error) {
            return next({ status: 500, message: 'Error fetching current Pokemon' });
        }
    }

    next();
}