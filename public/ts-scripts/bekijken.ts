async function getLastPokemonFromChain(id : number) : Promise<string> {
    const evolutionChain : any = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
    .then(response => response.json());
    const pokemonNames : string[] = [];
    let result : string = '';

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

export {
    getLastPokemonFromChain,
  fetchPokemonByName
};
