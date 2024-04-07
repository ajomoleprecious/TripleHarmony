export async function getPokemon(pokemons: any[]) {
  for (let i = 0; i < 898; i++) {
      try
      {
        let pokemonId = i + 1;
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        let pokemon = await response.json();
        pokemons.push(pokemon);
      }
      catch (error)
      {
        console.log(error);
      }
  }
  
}
