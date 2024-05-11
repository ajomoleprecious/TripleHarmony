let hamMenu = document.querySelector('.hamMenu');
hamMenu.addEventListener('click', () => {
    document.querySelector('.nav-container ul').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nav-menus ul').classList.add('active');
    setTimeout(() => {
        document.querySelector('#nav-menus ul').classList.remove('active');
    }, 1000);
});

async function changeAvatar(name) {
    await fetch(`./change-avatar/${name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            location.reload();
        }
    });
}

// Constants for event types
/*const VISIBILITY_CHANGE_EVENT = 'visibilitychange';
const BEFORE_UNLOAD_EVENT = 'beforeunload';

// Global variable to store the audio object
let audio;
let audioWasPlaying = false;

// Function to play the sound
function playSound(soundFile) {
  audio = new Audio(soundFile);
  document.body.addEventListener('click', () => {
    audio.play();
    audioWasPlaying = true;
    document.body.removeEventListener('click', playSound);
  });
}

// Function to check if the audio is still playing
function isAudioPlaying() {
  return audio.playing;
}

// Event handler for the visibilitychange event of the document
document.addEventListener(VISIBILITY_CHANGE_EVENT, () => {
  if (document.visibilityState === 'hidden') {
    // Pause the audio when the page is hidden
    audio.pause();
    audioWasPlaying = isAudioPlaying();
  } else if (document.visibilityState === 'visible' && audioWasPlaying) {
    // Resume playing the audio when the page is shown again
    audio.play();
  }
});

// Event handler for the beforeunload event of the window
window.addEventListener(BEFORE_UNLOAD_EVENT, (event) => {
  if (isAudioPlaying()) {
    // Prevent the page from unloading and continue playing the audio
    event.preventDefault();
  }
});

playSound('/assets/game.ogg');*/