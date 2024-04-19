window.onload = function () {
    const modal = new bootstrap.Modal(document.getElementById('register'), {
        keyboard: false
    });
    modal.show();
}

const registerForm = document.getElementById('register-form');
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const confirmPasswordLabel = document.querySelector('label[for="registerConfirmPassword"]');
const registerPasswordReveal = document.getElementById('registerPasswordReveal');
const registerConfirmPasswordReveal = document.getElementById('registerConfirmPasswordReveal');

registerForm.addEventListener('submit', async (event) => {
    if(registerPassword.value !== registerConfirmPassword.value) {
        event.preventDefault();
        confirmPasswordLabel.style.color = 'red';
        confirmPasswordLabel.textContent = 'Wachtwoorden komen niet overeen.';
        return;
    }
    else {
        window.href = '/register';
    }
});

registerConfirmPassword.addEventListener('focusout', () => {
    if (registerPassword.value !== registerConfirmPassword.value) {
        confirmPasswordLabel.style.color = 'red';
        confirmPasswordLabel.textContent = 'Wachtwoorden komen niet overeen.';
    }
    else {
        confirmPasswordLabel.style.color = 'darkgreen';
        confirmPasswordLabel.textContent = 'Wachtwoorden komen overeen.';
    }
});

registerPasswordReveal.addEventListener('click', () => {
    if (registerPassword.type === 'password') {
        registerPassword.type = 'text';
        registerPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
    else {
        registerPassword.type = 'password';
        registerPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

registerConfirmPasswordReveal.addEventListener('click', () => {
    if (registerConfirmPassword.type === 'password') {
        registerConfirmPassword.type = 'text';
        registerConfirmPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
    else {
        registerConfirmPassword.type = 'password';
        registerConfirmPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

const loginForm = document.getElementById('login-form');
const userName = document.getElementById('loginUsername');
const password = document.getElementById('loginPassword');
const passwordLabel = document.querySelector('label[for="loginPassword"]');
const loginPasswordReveal = document.getElementById('loginPasswordReveal');

loginForm.addEventListener('submit', async (event) => {
    if (userName.value === '' || password.value === '') {
        event.preventDefault();
        passwordLabel.style.color ='red';
        passwordLabel.textContent = 'Gebruikersnaam en wachtwoord zijn verplicht.';
        return;
    }
    else {
        window.href = '/login';
    }
});

loginPasswordReveal.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        loginPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
    else {
        password.type = 'password';
        loginPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

const resetForm = document.getElementById('reset-form');
const resetEmail = document.getElementById('resetEmail');
const resetEmailLabel = document.querySelector('label[for="resetEmail"]');

resetForm.addEventListener('submit', async (event) => {
    if (resetEmail.value === '') {
        event.preventDefault();
        resetEmailLabel.style.color = 'red';
        resetEmailLabel.textContent = 'E-mailadres is verplicht.';
        return;
    }
    else {
        window.href = '/reset';
    }
});