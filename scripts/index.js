function showBg() {
    let body = document.querySelector("body");
    let projects = document.querySelectorAll(".projects ul li");
    let projectContainer = document.querySelector(".projects");

    projects.forEach((project, index) => {
        project.addEventListener("mouseover", () => {
            body.style.backgroundImage = `url('assets/landing-page-bgs/bg_${getImageName(index)}.jpg')`;
            body.style.backgroundSize = "cover";
            body.style.backgroundPosition = "center";
            body.style.backgroundRepeat = "no-repeat";
            body.style.width = "100%";
            body.style.height = "100vh";
            switch (index) {
                case 0:
                    projectContainer.style.backgroundColor = "#f3f2b3";
                    break;
                case 1:
                    
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
                case 4:
                    
                    break;
                case 5:
                    
                    break;
            }
        });

        project.addEventListener("mouseout", () => {
            body.style.backgroundImage = "none";
            projectContainer.style.backgroundColor = "#f3f2b3";
        });
    });

    function getImageName(index) {
        let projectNames = ["pokemon", "fifa", "fortnite", "lotr", "lego", "magic"];
        return projectNames[index];
    }
}
function checkScreenSize() {
    if (window.innerWidth >= 1400) {
        showBg();
    }
}
window.onload = checkScreenSize;
window.addEventListener("resize", checkScreenSize);