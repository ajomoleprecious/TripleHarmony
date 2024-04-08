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
    else{
        glove.style.pointerEvents = "auto";
    }
}

checkScreenSize();
window.addEventListener("resize", checkScreenSize);

///////////////////////////////////////////////////////////////////////////////
//-----------------------WILLEKEURIGE AFBEELDINGEN--------------------------//

// Functie om een willekeurig getal tussen min (inclusief) en max (exclusief) te genereren
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Functie om een willekeurige afbeeldings-URL te genereren
  function generateRandomImageUrl() {
    const randomImageNumber = getRandomInt(1, 101); // Van 1 tot 100 (inclusief)
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${randomImageNumber}.gif`; // Pas de URL-structuur aan naar je behoefte
  }
  
  // Vind het DOM-element waarin de afbeelding wordt weergegeven
  const imageElements = document.getElementsByClassName('poke-catch-img');
  
  // Functie om elke seconde een nieuwe willekeurige afbeelding weer te geven
  function changeImage() {
    let count = 0;
    const interval = setInterval(() => {
      const imageUrl = generateRandomImageUrl();
      Array.from(imageElements).forEach((element) => {
        element.src = imageUrl;
      });
      count++;
      if (count >= 10) {
        clearInterval(interval); // Stop het interval na 10 seconden
      }
    }, 1000); // Elke seconde
  }
  
  // Start het proces van het wijzigen van afbeeldingen
  changeImage();
  