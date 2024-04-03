export async function getPokemon() {
  try
  {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=898`);
    const pokemon = await response.json();
    console.log(pokemon);
    return pokemon;
  }
  catch (error)
  {
    console.log(error);
  }
}

