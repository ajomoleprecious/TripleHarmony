// Import necessary modules and dependencies
import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentPokemon } from "../middleware/currentPokemon";
import { currentAvatar } from "../middleware/userAvatar";
import { client, pokemonsMaxEvolution } from "../index";
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
        const avatar = res.locals.currentAvatar;

        // Log the relevant portion of pokemonsMaxEvolution based on page and amount
        const start = page * amount;
        const end = start + amount;
        const paginatedPokemons = pokemonsMaxEvolution.slice(start, end);
        const evolutionChainIds: number[] = [];
        for (let i = start; i < end; i++) {
            evolutionChainIds.push(i + 1);
        }
        // set hasPrevious to true if paginatedPokemons has previous data
        const hasPreviousPage = start > 0;
        // set hasNext to true if paginatedPokemons has next data
        const hasNextPage = end < pokemonsMaxEvolution.length;

        // Add periodically to update 
        // Fetch Pokémons evolution chains
        //const { evolutionChainIds, hasNextPage, hasPreviousPage } = await fetchEvolutionChains(page, amount);
        // Fetch Pokémons by evolution chains
        //const evolutionChainPokemons = await fetchPokemonsByEvolutionChains(evolutionChainIds);
        //await client.db('users').collection('PokemonsMaxStages').insertMany(evolutionChainPokemons);

        // Render the page with fetched data
        res.status(200).render('pokemons-bekijken', {
            pageNumber: page + 1,
            evolutionChainIds,
            evolutionChainPokemons: paginatedPokemons,
            hasNextPage,
            hasPreviousPage,
            currentPokemon,
            avatar,
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorMessage: "Er is een fout opgetreden bij het ophalen van de Pokémon gegevens." });
    }
});

// Route handler for filtering and fetching Pokémon data
router.get("/filter", async (req: Request, res: Response) => {
    // Extract query parameters or set defaults
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    //const amount = req.query.amount ? parseInt(req.query.amount as string) : 10;
    const pokemonType = req.query.pokemon_type ? req.query.pokemon_type as string : "";
    const sortBy = req.query.sort_by ? req.query.sort_by as string : "";
    const pokemonName = req.query.pokemon_name ? req.query.pokemon_name as string : "";
    try {
        // Get current pokemon and user's avatar
        const currentPokemon = res.locals.currentPokemon;
        const avatar = res.locals.currentAvatar;
        // Get pokemon by name
        if (pokemonName !== "") {
            const pokemon = await fetchPokemonByName(pokemonName);
            res.render('pokemons-bekijken', {
                pageNumber: page + 1,
                evolutionChainPokemons: [pokemon],
                hasNextPage: false,
                hasPreviousPage: false,
                currentPokemon,
                avatar,
            });
            return;
        }
        const filteredPokemons: any[] = [];
        // Filter pokemonsMaxEvolution by type
        if (pokemonType !== "none") {
            for (let i = 0; i < pokemonsMaxEvolution.length; i++) {
                pokemonsMaxEvolution[i].types.forEach((type: any) => {
                    if (type.type.name === pokemonType) {
                        filteredPokemons.push(pokemonsMaxEvolution[i]);
                    }
                });
            }
        }
        else {
            filteredPokemons.push(...pokemonsMaxEvolution);
        }
        // Sort filteredPokemons by sortBy
        if (sortBy === "name") {
            filteredPokemons.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "height") {
            filteredPokemons.sort((a, b) => a.height - b.height);
        } else if (sortBy === "weight") {
            filteredPokemons.sort((a, b) => a.weight - b.weight);
        }

        res.render('pokemons-bekijken', {
            pageNumber: page + 1,
            evolutionChainPokemons: filteredPokemons,
            hasNextPage: false,
            hasPreviousPage: false,
            currentPokemon,
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

// Helper functions for fetching Pokémon evolution chains and Pokémons by evolution chains
/*async function fetchEvolutionChains(page: number, amount: number) {
    const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/?limit=${amount}&offset=${page * amount}`);
    const evolutionChainIds: number[] = response.data.results.map((item: any) => item.url.split('/')[6]);
    const hasNextPage = !!response.data.next;
    const hasPreviousPage = !!response.data.previous;
    return { evolutionChainIds, hasNextPage, hasPreviousPage };
}*/

/*async function fetchPokemonsByEvolutionChains(evolutionChainIds: number[]) {
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
}*/



/*async function prefetchNextPageData(page: number, amount: number) {
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
}*/

// Function to fetch the last Pokémon from an evolution chain
// Function to fetch Pokémon data by name
async function fetchPokemonByName(name: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

// Export router
export default router;
