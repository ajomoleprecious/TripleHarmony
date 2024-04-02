export async function getPokemon(url : string) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}