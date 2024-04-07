export async function getPokeData() 
{
  let dataArray: any[] = [];

  try 
  {
    for (let i = 0; i < 898; i++) {
      const pokemonId = i + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemon: any = await response.json();
      dataArray.push(pokemon.name);
      console.log(dataArray);
    }     
    return dataArray;
  } 
  catch (error)
  {
    console.log(error);
    return [];
  }
}
