async function getPokemon(pokemonID) {
    const pokemonsLabel = document.getElementById('pokemonsLabel');
    const pokemondetailImg = document.getElementById('pokemondetailImg');
    const pokemonSetLink = document.getElementById('pokemonSetLink');
    const pokemonName = document.getElementById('pokemonName');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    const data = await response.json();
    pokemonsLabel.innerText = data.name.toString().charAt(0).toUpperCase() + data.name.toString().slice(1);
    pokemondetailImg.src = data.sprites.other['official-artwork'].front_default;
    pokemonName.innerText = data.name;

    pokemonSetLink.addEventListener('click', async () => {
        await fetch(`./changeCurrentPokemon/${pokemonID}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            }
        });
    });
}