export async function getPokeImages() 
{
  let dataArray: any[] = [];

  try 
  {
    for (let i = 0; i < 100; i++) {
      const pokemonId = i + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemon: any = await response.json();
      let image = pokemon.sprites.other.showdown.front_shiny;
      dataArray.push(image);
    }     
    return dataArray;
  } 
  catch (error)
  {
    console.log(error);
    return [];
  }
}