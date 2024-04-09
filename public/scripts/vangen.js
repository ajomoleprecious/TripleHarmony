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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomPokemonDataUrl() {
  const randomPokemonId = getRandomInt(1, 101);
  return `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`;
}

const imageElements = document.getElementsByClassName('poke-catch-img');
const titleElement = document.getElementById('poke-title');
const countdownElement = document.getElementById('countdown');
const hourglassElement = document.getElementById('hourglass');
const arrowElement = document.getElementsByClassName('roulette-arrow');

// Functie om elke seconde een nieuwe willekeurige afbeelding en titel weer te geven
async function changeImageAndTitle() {
  let count = 10; 
  const interval = setInterval(async () => {
      const pokemonDataUrl = generateRandomPokemonDataUrl();
      try {
          const response = await fetch(pokemonDataUrl);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const pokemonData = await response.json();
          const imageUrl = pokemonData.sprites.other.showdown.front_shiny;
          const pokemonName = pokemonData.name;
          Array.from(imageElements).forEach((element) => {
              element.src = imageUrl;
          });
          count--;
          if (count <= 0) {
              clearInterval(interval);
          }
          if (count === 0) {
            hourglassElement.style.display = 'none';
            arrowElement[0].style.animation = 'none';
            titleElement.innerText = pokemonName;
        }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }, 1000);
}

changeImageAndTitle();

