let body = document.querySelector("body");
let glove = document.querySelector(".boxing-gloves");
let pokemonImg = document.querySelector(".poke-catch-img");

function showCursorAsGlove() {
    body.style.cursor = "none";
    glove.style.width = "50px";
    glove.style.pointerEvents = "none";
}

function TrackCursor(e) {
    let imageWidth = 50; // width of your image
    let imageHeight = 50; // height of your image

    let x = e.clientX - (imageWidth / 2);
    let y = e.clientY - (imageHeight / 2);

    glove.style.left = x + "px";
    glove.style.top = y + "px";
}
function checkScreenSize() {
    if (window.innerWidth >= 800) {
        showCursorAsGlove();
        document.addEventListener("mousemove", TrackCursor);
    }
}

checkScreenSize();
window.addEventListener("resize", checkScreenSize);
