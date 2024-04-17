window.onload = function () {
    const modal = new bootstrap.Modal(document.getElementById('register'), {
        keyboard: false
    });
    modal.show();
}

const registerForm = document.getElementById('register-form');
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const passwordLabel = document.querySelector('label[for="registerPassword"]');
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

registerConfirmPassword.addEventListener('change', () => {
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