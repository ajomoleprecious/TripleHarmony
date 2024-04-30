async function ontvangPokemon() {
    await fetch('/pokemon-submenu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.message){
            location.href = '/huidige-pokemon';
        }
    })
}

async function changeAvatar(name) {
    await fetch(`./change-avatar/${name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            location.reload();
        }
    });
}