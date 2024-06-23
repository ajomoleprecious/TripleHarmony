// Function to change background image and styles based on list item hover
function showBg() {
    // Select the body element
    let body = document.querySelector("body");
    
    // Select all list items within the .projects section
    let projectItems = document.querySelectorAll(".projects ul li");
    
    // Select the .projects container
    let projectsContainer = document.querySelector(".projects");

    // Loop through each list item
    projectItems.forEach((item, index) => {
        // Add a mouseover event listener to each list item
        item.addEventListener("mouseover", () => {
            // Define an array of background image names corresponding to each list item
            const bgImages = ["pokemon", "fifa", "fortnite", "lotr", "lego", "magic"];
            
            // Set the background image of the body element based on the hovered item index
            body.style.backgroundImage = `url('assets/landing-page-bgs/bg_${bgImages[index]}.jpg')`;
            
            // Additional styling for the background
            body.style.backgroundSize = "cover";
            body.style.backgroundPosition = "center";
            body.style.backgroundRepeat = "no-repeat";
            body.style.width = "100%";
            body.style.height = "100vh";

            // Apply a fade effect to the .projects container
            projectsContainer.style.transition = "opacity 4s ease-in-out";
            projectsContainer.style.opacity = "0.6";
        });

        // Add a mouseout event listener to reset the background
        item.addEventListener("mouseout", () => {
            // Remove the background image from the body element
            body.style.backgroundImage = "none";
            
            // Reset the background color and opacity of the .projects container
            projectsContainer.style.backgroundColor = "#f3f2b3";  // Default background color
            projectsContainer.style.transition = "opacity 0.3s ease-in-out";
            projectsContainer.style.opacity = "1";
        });
    });
}

// Function to check screen size and conditionally apply the showBg function
function checkScreenSize() {
    // Only apply background changes if the screen width is 1400px or greater
    if (window.innerWidth >= 1400) {
        showBg();
    }
}

// Run checkScreenSize function when the window is fully loaded
window.onload = checkScreenSize;

// Run checkScreenSize function whenever the window is resized
window.addEventListener("resize", checkScreenSize);
