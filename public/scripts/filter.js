// Function to manage the layout based on the window width and the filter menu's state
function openFilterMenu() {
    // Check if the window width is 475 pixels or less
    if (window.innerWidth <= 475) {
        // If the aside element contains the 'active' class
        if (document.querySelector("aside").classList.contains("active")) {
            // Set the grid template areas for the .pokemon-bekijken element for small screens
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "main main"';
        } else {
            // If not active, keep the layout unchanged for small screens
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "main main"';
        }
    } else {
        // For screens larger than 475 pixels
        if (document.querySelector("aside").classList.contains("active")) {
            // Set the grid template areas for the .pokemon-bekijken element with aside visible
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "aside main"';
        } else {
            // Set the grid template areas for the .pokemon-bekijken element with aside hidden
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "main main"';
        }
    }
}

// Select the filter menu icon element
let filterMenu = document.querySelector(".fa-filter");

// Add a click event listener to the filter menu icon
filterMenu.addEventListener("click", () => {
    // Hide the filter menu icon
    filterMenu.style.display = "none";
    // Toggle the 'active' class on the aside element
    document.querySelector("aside").classList.toggle("active");
    // Call the openFilterMenu function to update the layout
    openFilterMenu();
});

// Select the close button for the filter menu
let closeFilter = document.querySelector(".filter-close");

// Add a click event listener to the close button
closeFilter.addEventListener("click", () => {
    // Show the filter menu icon
    filterMenu.style.display = "block";
    // Toggle the 'active' class on the aside element
    document.querySelector("aside").classList.toggle("active");
    // Call the openFilterMenu function to update the layout
    openFilterMenu();
});

// Initial call to set up the layout based on the current state and window size
openFilterMenu();
