async function ontvangPokemon() {
    try {
        // Send a POST request to "/pokemon-submenu"
        let response = await fetch("/pokemon-submenu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Specify the content type as JSON
            }
        });

        // Parse the JSON response
        let data = await response.json();

        // If the response contains a message, redirect to the "/huidige-pokemon" page
        if (data.message) {
            location.href = "/huidige-pokemon";
        }
    } catch (error) {
        console.error("Error in ontvangPokemon:", error); // Log any errors that occur
    }
}

async function changeAvatar(avatar) {
    try {
        // Send a POST request to "./change-avatar/{n}"
        let response = await fetch(`./change-avatar/${avatar}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Specify the content type as JSON
            }
        });

        // If the request was successful, reload the page
        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.error("Error in changeAvatar:", error); // Log any errors that occur
    }
}
