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
     const page = req.query.page ? parseInt(req.query.page as string) : 0;
     const amount = req.query.amount ? parseInt(req.query.amount as string) : 10;

     try {
        // Get current pokemon and user's avatar
        const currentPokemon = res.locals.currentPokemon;
        const user = await getUserData(res.locals.user._id);
        const pokemonHP = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonHP;
        const pokemonDefense = user?.pokemons.find((pokemon: any) => pokemon.pokemonId === currentPokemon.id)?.pokemonDefense;
        const avatar = res.locals.currentAvatar;

        res.render('pokemons-bekijken', {
            pageNumber: page + 1,
            evolutionChainIds: [],
            evolutionChainPokemons: [],
            hasNextPage: false,
            hasPreviousPage: false,
            currentPokemon,
            pokemonHP,
            pokemonDefense,
            avatar,
        });
     }
     catch (error) {
        console.error(error);
        res.status(500).render('error', { errorMessage: "Er is een fout opgetreden bij het ophalen van de Pokémon gegevens." });
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
