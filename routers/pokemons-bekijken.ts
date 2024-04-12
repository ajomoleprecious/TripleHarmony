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
        res.status(500).type('text/html').sendFile('../views/error.html', { root: __dirname });
    }
});

router.get("/filter", async (req: Request, res: Response) => {
    let page = req.query.page ? Number(req.query.page) : 0;
    let amountOfPokemons = req.query.amountOfPokemons ? Number(req.query.amountOfPokemons) : 50;
    let offset = page * amountOfPokemons;
    let evolution_chain_ids: number[] = [];
    let pokemonIDs: number[] = [];
    let pokemon_name = req.query.pokemon_name ? req.query.pokemon_name.toString() : '';
    let pokemon_type = req.query.pokemon_type ? req.query.pokemon_type.toString() : '';
    let sort_by = req.query.sort_by ? req.query.sort_by.toString() : 'naam';
    const pokemonData: any[] = [];

    try {
        if (pokemon_name !== '') {
            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name.toLowerCase()}`);
            const chainID = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_name.toLowerCase()}`);
            const pokemonChain = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${chainID.data.evolution_chain.url.split('/')[6]}`);

            


            //pokemonIDs.push(pokemonResponse.data.id);
            //pokemonData.push(pokemonResponse.data);
            pokemonData.push(pokemonResponse.data);
            evolution_chain_ids.push(pokemonChain.data.id);
            console.log(pokemonChain.data.id);
            //res.json({ chainID: pokemonChain.data.id, pokemonID: pokemonResponse.data.id });
            res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, pokemonIDs, evolution_chain_ids });
        }
        else {
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
            res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, pokemonIDs, evolution_chain_ids, pokemon_name, pokemon_type, sort_by });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).type('text/html').sendFile('../views/error.html', { root: __dirname });
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

async function fetchPokemonsByTypeAndSort(type: string, sortBy: string, offset: number, limit: number) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data: any = await response.json();
    const pokemons = data.pokemon.map((item: any) => item.pokemon);
    let pokemonData: any[] = [];

    // Create an array of promises to fetch Pokémon data concurrently
    const pokemonPromises = pokemons.map(async (item: any) => {
        let name: string = item.name;
        let pokemonData = await fetchPokemonByName(name);
        return pokemonData;
    });

    // Wait for all Pokémon data to be fetched concurrently
    pokemonData = await Promise.all(pokemonPromises);

    // Sort the data by the given sort_by parameter
    switch (sortBy) {
        case 'name':
            pokemonData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'height':
            pokemonData.sort((a, b) => a.height - b.height);
            break;
        case 'weight':
            pokemonData.sort((a, b) => a.weight - b.weight);
            break;
    }

    // Return the requested amount of Pokémon data
    return pokemonData.slice(offset, offset + limit);
}

export default router;