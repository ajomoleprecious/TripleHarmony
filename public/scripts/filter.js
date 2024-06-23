// Function to adjust the layout based on the filter menu state and window width
function openFilterMenu() {
    // Check if the window width is less than or equal to 475 pixels
    if (window.innerWidth <= 475) {
        // For small screens, if the aside (filter menu) is active, change the grid layout to hide the aside
        if (document.querySelector("aside").classList.contains("active")) {
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "main main"';
        }
    } else {
        // For larger screens, adjust the grid layout based on the filter menu state
        if (document.querySelector("aside").classList.contains("active")) {
            // If the filter menu is active, show the aside in the grid layout
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "aside main"';
        } else {
            // If the filter menu is not active, hide the aside in the grid layout
            document.querySelector(".pokemon-bekijken").style.gridTemplateAreas = '"header header" "main main"';
        }
    }
}

// Select the filter menu button (usually a filter icon with the class 'fa-filter')
let filterMenu = document.querySelector(".fa-filter");

// Add a click event listener to the filter menu button
filterMenu.addEventListener("click", () => {
    // Hide the filter menu button
    filterMenu.style.display = "none";
    
    // Toggle the 'active' class on the aside (filter menu)
    document.querySelector("aside").classList.toggle("active");
    
    // Adjust the layout based on the new filter menu state
    openFilterMenu();
});

// Select the close button inside the filter menu (with the class 'filter-close')
let closeFilter = document.querySelector(".filter-close");

// Add a click event listener to the close button
closeFilter.addEventListener("click", () => {
    // Show the filter menu button
    filterMenu.style.display = "block";
    
    // Toggle the 'active' class on the aside (filter menu)
    document.querySelector("aside").classList.toggle("active");
    
    // Adjust the layout based on the new filter menu state
    openFilterMenu();
});

// Initial call to set up the correct layout based on the current window size and filter menu state
openFilterMenu();
