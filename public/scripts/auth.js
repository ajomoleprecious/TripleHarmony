window.onload = function () {
    const modal = new bootstrap.Modal(document.getElementById('register'), {
        keyboard: false
    });
    modal.show();
}

const handleErrors = (err) => {
    let errors = { email: '', username: '', password: '' };

    // Duplicate error code
    if (err.code === 11000) {
        if (err.keyValue.email) {
            errors.email = 'Dit e-mailadres is al geregistreerd';
        }
        if (err.keyValue.username) {
            errors.username = 'Deze gebruikersnaam is al geregistreerd';
        }
    }

    // Validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
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

    /*try {
        const response = await fetch('/pokemon-auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        const data = await response.json();

        if (data.errors) {
            const errors = handleErrors(data.errors);
            registerEmailError.textContent = errors.email;
            registerUsernameError.textContent = errors.username;
            registerPasswordError.textContent = errors.password;
        }
    } catch (_) {
        
    }*/

});

registerEmail.addEventListener('input', () => {
    if (registerEmail.value === '') {
        registerEmailLabel.style.color = 'red';
    }
    else {
        registerEmailLabel.style.color = 'black';
        registerEmailError.textContent = '';
    }
});

registerUsername.addEventListener('input', () => {
    if (registerUsername.value === '') {
        registerUsernameLabel.style.color = 'red';
    }
    else {
        registerUsernameLabel.style.color = 'black';
        registerUsernameError.textContent = '';
    }
});

registerPassword.addEventListener('input', () => {
    if (registerPassword.value.length < 8) {
        registerPasswordLabel.style.color = 'red';
    }
    else {
        registerPasswordLabel.style.color = 'black';
        registerPasswordError.textContent = '';
    }
});

registerConfirmPassword.addEventListener('input', () => {
    if (registerConfirmPassword.value !== registerPassword.value) {
        registerConfirmPasswordLabel.style.color = 'red';
        registerConfirmPasswordError.textContent = '• Wachtwoorden komen niet overeen';
    }
    else {
        registerConfirmPasswordLabel.style.color = 'black';
        registerConfirmPasswordError.textContent = '';
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
                userNameError.textContent = `• ${data.errors.username}`
            }
            if (data.errors.password) {
                passwordError.textContent = `• ${data.errors.password}`
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
    }
    else {
        userNameLabel.style.color = 'black';
    }
});

password.addEventListener('input', () => {
    if (password.value === '' || password.value.length < 8) {
        passwordLabel.style.color = 'red';
    }
    else {
        passwordLabel.style.color = 'black';
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