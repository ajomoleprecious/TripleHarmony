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
