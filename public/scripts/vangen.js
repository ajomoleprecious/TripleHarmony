let body = document.querySelector("body"),
    glove = document.querySelector(".boxing-gloves"),
    pokemonImg = document.querySelector(".poke-catch-img");

function showCursorAsGlove() {
    body.style.cursor = "none";
    glove.style.width = "50px";
    glove.style.pointerEvents = "none";
}

function TrackCursor(e) {
    let o = e.clientX - 25,
        n = e.clientY - 25;
    glove.style.left = o + "px";
    glove.style.top = n + "px";
}

function checkScreenSize() {
    if (window.innerWidth >= 800) {
        showCursorAsGlove();
        document.addEventListener("mousemove", TrackCursor);
    } else {
        glove.style.display = "none";
    }
}

checkScreenSize();

window.addEventListener("resize", function() {
    window.location.reload();
});
