// Function to fetch evolution chain data based on ID
async function fetchEvolutionChain(id : number) {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
    const data = await response.json();
    return data;
}

// Function to create HTML list from evolution chain data
async function createPokemonList(id : number) : Promise<string[]> {
    const evolutionChain : any = await fetchEvolutionChain(id);
    const pokemonNames : string[] = [];
    const results : string[] = [];

    // Extract Pokemon names from the evolution chain data
    function extractNames(chain : any) {
        pokemonNames.push(chain.species.name);
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((evolution : any) => {
                extractNames(evolution);
            });
        }
    }
    extractNames(evolutionChain.chain);
    //push of every item in the array pokemonNames the last one to the results array
    for (let i = 0; i < pokemonNames.length; i++) {
        if (i === pokemonNames.length - 1) {
            results.push(pokemonNames[i]);
        }
    }
    return results;
}

async function fetchPokemonByName(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data;
}

export {
  createPokemonList,
  fetchPokemonByName
};
