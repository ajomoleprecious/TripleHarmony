function openFilterMenu() {
    if (window.innerWidth <= 475) {
        if (document.querySelector('aside').classList.contains('active')) {
            document.querySelector('.pokemon-bekijken').style.gridTemplateAreas = '"header header" "main main"';
        }
        else {
            document.querySelector('.pokemon-bekijken').style.gridTemplateAreas = '"header header" "main main"';
        }
    }
    else {
        if (document.querySelector('aside').classList.contains('active')) {
            document.querySelector('.pokemon-bekijken').style.gridTemplateAreas = '"header header" "aside main"';
        }
        else {
            document.querySelector('.pokemon-bekijken').style.gridTemplateAreas = '"header header" "main main"';
        }
    }
}

let filterMenu = document.querySelector('.fa-filter');
filterMenu.addEventListener('click', () => {
    filterMenu.style.display = 'none';
    document.querySelector('aside').classList.toggle('active');
    openFilterMenu();
});
let closeFilter = document.querySelector('.filter-close');
closeFilter.addEventListener('click', () => {
    filterMenu.style.display = 'block';
    document.querySelector('aside').classList.toggle('active');
    openFilterMenu();
});
openFilterMenu();
