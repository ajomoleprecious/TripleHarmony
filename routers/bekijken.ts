// Import necessary modules and dependencies
import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import express from "express";

import axios from 'axios';
import { get } from "http";
import { ObjectId } from "mongodb";

// Initialize router
const router = Router();
// Use the middleware
router.use(verifyUser);
router.use(currentAvatar);
router.use(currentPokemon);
// Serve static files from the 'public' directory
router.use(express.static('public'));

// Route handler for fetching and rendering Pokémon data
router.get("/", async (req: Request, res: Response) => {
    // Extract query parameters or set defaults
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    const amount = req.query.amount ? parseInt(req.query.amount as string) : 10;

    try {
        // Get current pokemon and user's avatar
        const currentPokemon = res.locals.currentPokemon;
        const user = await getUserData(res.locals.user._id);
        const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
        const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;
        const avatar = res.locals.currentAvatar;

        // Fetch Pokémons evolution chains
        const { evolutionChainIds, hasNextPage, hasPreviousPage } = await fetchEvolutionChains(page, amount);

        // Fetch Pokémons by evolution chains
        const evolutionChainPokemons = await fetchPokemonsByEvolutionChains(evolutionChainIds);

        // Render the page with fetched data
        res.status(200).render('pokemons-bekijken', {
            pageNumber: page + 1,
            evolutionChainIds,
            evolutionChainPokemons,
            hasNextPage,
            hasPreviousPage,
            currentPokemon,
            pokemonHP,
            pokemonDefense,
            avatar,
        });
        if (hasPreviousPage) {
            prefetchPreviousPageData(page - 1, amount);
        }
        // Prefetch next page data in the background
        if (hasNextPage) {
            prefetchNextPageData(page + 1, amount);
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorMessage: "Er is een fout opgetreden bij het ophalen van de Pokémon gegevens." });
    }
});

// Route handler for filtering and fetching Pokémon data
router.get("/filter", async (req: Request, res: Response) => {
    // Extract query parameters or set defaults
    let page = req.query.page ? Number(req.query.page) : 0;
    let amountOfPokemons = req.query.amountOfPokemons ? Number(req.query.amountOfPokemons) : 50;
    let offset = page * amountOfPokemons;
    let evolution_chain_ids: number[] = [];
    let pokemonIDs: number[] = [];
    let pokemon_name = req.query.pokemon_name ? req.query.pokemon_name.toString() : '';
    let pokemon_type = req.query.pokemon_type ? req.query.pokemon_type.toString() : '';
    let sort_by = req.query.sort_by ? req.query.sort_by.toString() : 'naam';
    let pokemonData: any[] = [];
    const currentPokemon = res.locals.currentPokemon;
    const user = await client.db('users').collection('usersPokemons').findOne({ _id: res.locals.user._id });
    const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
    const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;
    const avatar = res.locals.currentAvatar;

    if (pokemon_name !== '') {
        try {
            // Fetch data for a specific Pokémon
            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name.toLowerCase()}`);
            const chainID = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_name.toLowerCase()}`);
            const pokemonChain = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${chainID.data.evolution_chain.url.split('/')[6]}`);

            // Store fetched data
            pokemonIDs.push(pokemonResponse.data.id);
            pokemonData.push(pokemonResponse.data);
            evolution_chain_ids.push(pokemonChain.data.id);

            //Filter by type
            if (pokemon_type !== '') {
                pokemonData = pokemonData.filter(pokemon => pokemon.types.some((type: { type: { name: string; }; }) => type.type.name === pokemon_type.toLowerCase()));
            }

            //Sort by name(asc), pokemon Id(pokemon_nr), weight or length
            switch (sort_by) {
                case 'name':
                    pokemonData.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'pokemon_nr':
                    pokemonData.sort((a, b) => a.id - b.id);
                    break;
                case 'weight':
                    pokemonData.sort((a, b) => a.weight - b.weight);
                    break;
                case 'length':
                    pokemonData.sort((a, b) => a.height - b.height);
                    break;
                default:
                    pokemonData.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            // Reinitialize evolution_chain_ids array
            evolution_chain_ids = [];

            // Loop through filtered pokemonData to get evolution_chain_ids
            for (const pokemon of pokemonData) {
                const chainID = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
                const evolutionChainID = chainID.data.evolution_chain.url.split('/')[6];
                evolution_chain_ids.push(evolutionChainID);
            }

            // Render the page with fetched data
            res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, pokemonIDs, evolution_chain_ids, currentPokemon, pokemonHP, pokemonDefense, avatar });
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                // Render the failed result page with an appropriate message
                res.status(404).render('error', { errorMessage: "Pokémon werd niet gevonden" });
            } else {
                // Render the failed result page with a generic error message
                res.status(500).render('error', { errorMessage: "Er is een fout opgetreden bij het ophalen van de Pokémon gegevens." });
            }
        }
    } else {
        // Fetch evolution chain data from PokeAPI
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
        let pokemonData = await Promise.all(pokemonPromises);

        //Filter by type
        if (pokemon_type !== '') {
            pokemonData = pokemonData.filter(pokemon => pokemon.types.some((type: { type: { name: string; }; }) => type.type.name === pokemon_type.toLowerCase()));
        }

        //Sort by name(asc), pokemon Id, weight or length
        switch (sort_by) {
            case 'name':
                pokemonData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'pokemon_nr':
                pokemonData.sort((a, b) => a.id - b.id);
                break;
            case 'weight':
                pokemonData.sort((a, b) => a.weight - b.weight);
                break;
            case 'length':
                pokemonData.sort((a, b) => a.height - b.height);
                break;
            default:
                pokemonData.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        // Reinitialize evolution_chain_ids array
        evolution_chain_ids = [];

        // Loop through fetched pokemonData to get evolution_chain_ids
        for (const pokemon of pokemonData) {
            const chainID = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
            const evolutionChainID = chainID.data.evolution_chain.url.split('/')[6];
            evolution_chain_ids.push(evolutionChainID);
        }

        // Extract Pokémon IDs
        pokemonIDs = pokemonData.map(pokemon => pokemon.id);

        // Render the page with fetched data and filter options
        res.render('pokemons-bekijken', { pageNumber: page + 1, pokemonData, pokemonIDs, evolution_chain_ids, pokemon_name, pokemon_type, sort_by, currentPokemon, pokemonHP, pokemonDefense, avatar });
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



// Helper functions
async function getUserData(userId: string) {
    return await client.db('users').collection('usersPokemons').findOne({ _id: new ObjectId(userId) });
}

async function fetchEvolutionChains(page: number, amount: number) {
    const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/?limit=${amount}&offset=${page * amount}`);
    const evolutionChainIds: number[] = response.data.results.map((item: any) => item.url.split('/')[6]);
    const hasNextPage = !!response.data.next;
    const hasPreviousPage = !!response.data.previous;
    return { evolutionChainIds, hasNextPage, hasPreviousPage };
}

async function fetchPokemonsByEvolutionChains(evolutionChainIds: number[]) {
    const pokemons: any[] = [];
    const chainIDs = evolutionChainIds;
    for (const id of chainIDs) {
        const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
        let chain = response.data.chain;
        // Traverse the evolution chain until the last evolution is reached
        while (chain.evolves_to.length > 0) {
            chain = chain.evolves_to[0];
        }
        // Fetch the last evolution of the chain
         let pokemonName = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${chain.species.url.split('/')[6]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                return data.varieties[0].pokemon.name;
            })
            .catch(error => console.error(error));

        // Push the last evolution to the array
        const pokemon = await fetchPokemonByName(pokemonName);
        pokemons.push(pokemon);
    }
    return pokemons;
}



async function prefetchNextPageData(page: number, amount: number) {
    try {
        const { evolutionChainIds } = await fetchEvolutionChains(page, amount);
        await fetchPokemonsByEvolutionChains(evolutionChainIds);
    } catch (error) {
        console.error(error);
    }
}

async function prefetchPreviousPageData(page: number, amount: number) {
    try {
        const { evolutionChainIds } = await fetchEvolutionChains(page, amount);
        await fetchPokemonsByEvolutionChains(evolutionChainIds);
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch the last Pokémon from an evolution chain
async function getLastPokemonFromChain(id: number): Promise<string> {
    const response = axios.get(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    let chain = (await response).data.chain;
    while (chain.evolves_to.length > 0) {
        chain = chain.evolves_to[0];
    }
    return chain.species.name;
}

// Function to fetch Pokémon data by name
async function fetchPokemonByName(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

// Export router
export default router;
