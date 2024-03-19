let pokemonTofight = document.querySelector(".battlefield article:nth-child(2) img");
let fightButtons = document.querySelectorAll(".aanvallen li");
let punchAnim = document.querySelector(".pokemon-damage img:nth-child(2)");

fightButtons.forEach((button) => {
    button.addEventListener("click", () => {
        punchAnim.style.display = "block";
        pokemonTofight.style.animation = "damage .5s";
        pokemonTofight.style.animationdelay = "1s";
        setTimeout(() => {
            punchAnim.style.display = "none";
        }, 1000);
        setTimeout(() => {
            pokemonTofight.style.animation = "none";
        }, 1500);
    });
});