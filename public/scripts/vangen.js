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
const rouletteElement = document.getElementsByClassName('roulette-box')[0];
const catchElement = document.getElementById('catch-button');
let count = 8;
const linkElement = document.getElementsByClassName('poke-catch-container')[0];

// Functie om elke seconde een nieuwe willekeurige afbeelding en titel weer te geven
async function changeImageAndTitle() { 
  const interval = setInterval(async () => {
      const pokemonDataUrl = generateRandomPokemonDataUrl();
      try {
          const response = await fetch(pokemonDataUrl);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const pokemonData = await response.json();
          const imageUrl = pokemonData.sprites.front_default;
          const pokemonName = pokemonData.name;
          Array.from(imageElements).forEach((element) => {
              element.src = imageUrl;
          });
          if (count <= 0) {
              clearInterval(interval);
              countdownElement.style.display = 'none'; // Hide countdown element when count reaches 0
          }
          if (count === 0) {
            hourglassElement.style.display = 'none';
            rouletteElement.style.animation = 'none';
            titleElement.innerText = pokemonName;
            linkElement.style.pointerEvents = 'auto';
        }
        countdownElement.innerText = count; // Update countdown element with count value
        count--;

      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }, 1000);
}

catchElement.addEventListener('mouseover', function() {
    if (catchElement.classList.contains('clicked')) {
        catchElement.style.animation = 'swing 1s infinite';
    }
    else
    {
        catchElement.style.animation = 'swing 1s infinite';
    }
});

catchElement.addEventListener('mouseout', function() {
    catchElement.style.animation = 'none'; 
});



catchElement.addEventListener('click', function(event) {
    event.preventDefault();
    linkElement.style.pointerEvents = 'none';
    catchElement.style.animation = 'catch 1s';
    titleElement.innerText = '';
    hourglassElement.src = '../assets/hourglass.gif';
    hourglassElement.alt = 'Hourglass Image';
    hourglassElement.style.animation = 'spin 2s linear infinite';
    rouletteElement.style.animation = 'spin 9s linear infinite';
    count = 8;
    countdownElement.innerText = count; // Initialize countdown element with initial count value
    countdownElement.style.display = 'block'; // Show countdown element
    changeImageAndTitle();
    hourglassElement.style.display = 'block';
    catchElement.classList.add('clicked');
});
