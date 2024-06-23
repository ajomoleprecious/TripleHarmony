// Select the hamburger menu element
let hamMenu = document.querySelector(".hamMenu");

// Function to change the avatar
async function changeAvatar(avatarId) {
    try {
        // Send a POST request to the server to change the avatar
        let response = await fetch(`./change-avatar/${avatarId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // If the request is successful, reload the page to update the avatar
        if (response.ok) {
            location.reload();
        } else {
            console.error("Failed to change avatar:", response.statusText);
        }
    } catch (error) {
        console.error("Error changing avatar:", error);
    }
}

// Event listener for the hamburger menu click event
hamMenu.addEventListener("click", () => {
    // Toggle the "active" class on the navigation menu
    document.querySelector(".nav-container ul").classList.toggle("active");
});

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Add the "active" class to the navigation menu
    document.querySelector("#nav-menus ul").classList.add("active");

    // Remove the "active" class from the navigation menu after 1 second
    setTimeout(() => {
        document.querySelector("#nav-menus ul").classList.remove("active");
    }, 1000);  // 1e3 milliseconds is equivalent to 1000 milliseconds or 1 second
});
