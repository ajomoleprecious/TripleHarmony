window.onload = function () {
    const modal = new bootstrap.Modal(document.getElementById('register'), {
        keyboard: false
    });
    modal.show();
}

const registerForm = document.getElementById('register-form');
const registerEmail = document.getElementById('registerEmail');
const registerEmailLabel = document.querySelector('label[for="registerEmail"]');
const registerUsername = document.getElementById('registerUsername');
const registerUsernameLabel = document.querySelector('label[for="registerUsername"]');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordLabel = document.querySelector('label[for="registerPassword"]');
const registerConfirmPasswordLabel = document.querySelector('label[for="registerConfirmPassword"]');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const registerPasswordReveal = document.getElementById('registerPasswordReveal');
const registerConfirmPasswordReveal = document.getElementById('registerConfirmPasswordReveal');
const registerEmailError = document.getElementById('registerEmailError');
const registerUsernameError = document.getElementById('registerUsernameError');
const registerPasswordError = document.getElementById('registerPasswordError');
const registerConfirmPasswordError = document.getElementById('registerConfirmPasswordError');




registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const registerData = Object.fromEntries(formData);
    // Reset the error messages
    registerEmailError.textContent = '';
    registerUsernameError.textContent = '';
    registerPasswordError.textContent = '';
    registerConfirmPasswordError.textContent = '';


    try {
        const response = await fetch('/pokemon-auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        const data = await response.json();
        if (data.errors) {
            if (data.errors.email) {
                registerEmailError.textContent = `• ${data.errors.email}`;
                registerEmail.style.border = '3px solid red';
            }
            if (data.errors.username) {
                registerUsernameError.textContent = `• ${data.errors.username}`;
                registerUsername.style.border = '3px solid red';
            }
            if (data.errors.password) {
                registerPasswordError.textContent = `• ${data.errors.password}`;
                registerPassword.style.border = '3px solid red';
            }
            if(registerPassword.value !== registerConfirmPassword.value){
                registerConfirmPasswordError.textContent = '• Wachtwoorden komen niet overeen';
                registerConfirmPassword.style.border = '3px solid red';
            }
        }
        if (data.user) {
            window.location.href = '/register-success';
        }
    
    } catch (error) {
        console.error('Error:', error);
    }
});

registerEmail.addEventListener('input', () => {
    if (registerEmail.value === '') {
        registerEmailLabel.style.color = 'red';
        registerEmail.style.border = '3px solid red';
    }
    else {
        registerEmailLabel.style.color = 'black';
        registerEmailError.textContent = '';
        registerEmail.style.border = 'none';
    }
});

registerUsername.addEventListener('input', () => {
    if (registerUsername.value === '') {
        registerUsernameLabel.style.color = 'red';
        registerUsername.style.border = '3px solid red';
    }
    else {
        registerUsernameLabel.style.color = 'black';
        registerUsernameError.textContent = '';
        registerUsername.style.border = 'none';
    }
});

registerPassword.addEventListener('input', () => {
    if (registerPassword.value.length < 8) {
        registerPasswordLabel.style.color = 'red';
        registerPassword.style.border = '3px solid red';
    }
    else {
        registerPasswordLabel.style.color = 'black';
        registerPasswordError.textContent = '';
        registerPassword.style.border = 'none';
    }
});

registerConfirmPassword.addEventListener('input', () => {
    if (registerConfirmPassword.value !== registerPassword.value) {
        registerConfirmPasswordError.textContent = '• Wachtwoorden komen niet overeen';
        registerConfirmPassword.style.border = '3px solid red';
    }
    else {
        registerConfirmPasswordError.textContent = '';
        registerConfirmPassword.style.border = 'none';
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
const userNameError = document.getElementById('loginUsernameError');
const userNameLabel = document.querySelector('label[for="loginUsername"]');
const password = document.getElementById('loginPassword');
const passwordError = document.getElementById('loginPasswordError');
const passwordLabel = document.querySelector('label[for="loginPassword"]');
const loginPasswordReveal = document.getElementById('loginPasswordReveal');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const loginData = Object.fromEntries(formData);

    // Reset the error messages
    userNameError.textContent = '';
    passwordError.textContent = '';

    try {
        const response = await fetch('/pokemon-auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        if (data.errors) {
            if (data.errors.username) {
                userNameError.textContent = `• ${data.errors.username}`;
                // If the username is invalid, focus on the username input
                userName.focus();
                userName.style.border = '3px solid red';

            }
            if (data.errors.password) {
                passwordError.textContent = `• ${data.errors.password}`;
                // If the password is invalid, focus on the password input
                password.focus();
                password.style.border = '3px solid red';
            }
        }
        if (data.user) {
            window.location.href = '/pokemon-submenu';
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});

userName.addEventListener('input', () => {
    if (userName.value === '') {
        userNameLabel.style.color = 'red';
        userName.style.border = '3px solid red';
    }
    else {
        userNameLabel.style.color = 'black';
        userName.style.border = 'none';
    }
});

password.addEventListener('input', () => {
    if (password.value === '' || password.value.length < 8) {
        passwordLabel.style.color = 'red';
        password.style.border = '3px solid red';
    }
    else {
        passwordLabel.style.color = 'black';
        password.style.border = 'none';
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
    event.preventDefault();
    if (resetEmail.value === '') {
        resetEmailLabel.style.color = 'red';
        resetEmailLabel.textContent = 'E-mailadres is verplicht.';
        resetEmail.style.border = '3px solid red';
        return;
    }
    else {
        window.href = '/reset';
    }
});