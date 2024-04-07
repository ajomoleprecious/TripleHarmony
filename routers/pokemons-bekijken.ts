import { Request, Response, Router } from "express";
import axios from 'axios';

const router = Router();


router.get("/", async (req: Request, res: Response) => {
    let page = req.query.page ? Number(req.query.page) : 0;
    let amountOfPokemons = req.query.amountOfPokemons ? Number(req.query.amountOfPokemons) : 50;
    let offset = page * amountOfPokemons;
    let evolution_chain_ids: number[] = [];
    let pokemonIDs: number[] = [];

    try {
        const pokemonsChainResponse = await axios.get(`https://pokeapi.co/api/v2/evolution-chain?offset=${offset}&limit=${amountOfPokemons}`);
        const pokemonsChain = pokemonsChainResponse.data;

        // Create an array of promises to fetch Pokémon data concurrently
        const pokemonPromises = pokemonsChain.results.map(async (item: any) => {
            let id: number = item.url.split('/')[6];
            evolution_chain_ids.push(id);
            let lastPokemon = await getLastPokemonFromChain(id);
            return fetchPokemonByName(lastPokemon);
        });

        // Wait for all Pokémon data to be fetched concurrently
        const pokemonData = await Promise.all(pokemonPromises);

        // Extract Pokémon IDs
        pokemonIDs = pokemonData.map(pokemon => pokemon.id);

        res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, pokemonIDs, evolution_chain_ids });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

async function getLastPokemonFromChain(id: number): Promise<string> {
    const evolutionChain: any = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
        .then(response => response.json());
    const pokemonNames: string[] = [];
    let result: string = '';

    // Extract Pokemon names from the evolution chain data
    function extractNames(chain: any) {
        pokemonNames.push(chain.species.name);
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((evolution: any) => {
                extractNames(evolution);
            });
        }
    }
    extractNames(evolutionChain.chain);
    //push of every item in the array pokemonNames the last one to the results array
    for (let i = 0; i < pokemonNames.length; i++) {
        if (i === pokemonNames.length - 1) {
            result = pokemonNames[i];
        }
    }
    return result;
}

async function fetchPokemonByName(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

export default router;