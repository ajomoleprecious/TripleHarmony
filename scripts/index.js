function showBg() {
    let body = document.querySelector("body");
    let projects = document.querySelectorAll(".projects ul li");

    projects.forEach((project, index) => {
        project.addEventListener("mouseover", () => {
            body.style.backgroundImage = `url('assets/landing-page-bgs/bg_${getImageName(index)}.jpg')`;
            body.style.backgroundSize = "cover";
            body.style.backgroundPosition = "center";
            body.style.backgroundRepeat = "no-repeat";
            body.style.width = "100%";
            body.style.height = "100vh";
        });

        project.addEventListener("mouseout", () => {
            body.style.backgroundImage = "none";
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