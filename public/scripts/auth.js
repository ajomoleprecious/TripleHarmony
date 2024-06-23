// When the window finishes loading, show the registration modal
window.onload = function() {
    // Create a new bootstrap modal for the registration modal element
    let registerModal = new bootstrap.Modal(document.getElementById("register"), {
        keyboard: false // Prevent closing the modal with the keyboard
    });
    registerModal.show();
};

// Get form and input elements for the registration process
const registerForm = document.getElementById("register-form"),
      registerEmail = document.getElementById("registerEmail"),
      registerEmailLabel = document.querySelector('label[for="registerEmail"]'),
      registerUsername = document.getElementById("registerUsername"),
      registerUsernameLabel = document.querySelector('label[for="registerUsername"]'),
      registerPassword = document.getElementById("registerPassword"),
      registerPasswordLabel = document.querySelector('label[for="registerPassword"]'),
      registerConfirmPassword = document.getElementById("registerConfirmPassword"),
      registerConfirmPasswordLabel = document.querySelector('label[for="registerConfirmPassword"]'),
      registerPasswordReveal = document.getElementById("registerPasswordReveal"),
      registerConfirmPasswordReveal = document.getElementById("registerConfirmPasswordReveal"),
      registerEmailError = document.getElementById("registerEmailError"),
      registerUsernameError = document.getElementById("registerUsernameError"),
      registerPasswordError = document.getElementById("registerPasswordError"),
      registerConfirmPasswordError = document.getElementById("registerConfirmPasswordError");

// Event listener for form submission
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create a FormData object from the form
    let formData = new FormData(registerForm),
        data = Object.fromEntries(formData.entries()); // Convert FormData to a plain object

    // Clear any existing error messages
    registerEmailError.textContent = "";
    registerUsernameError.textContent = "";
    registerPasswordError.textContent = "";
    registerConfirmPasswordError.textContent = "";

    try {
        // Send a POST request to register the user
        let response = await fetch("/pokemon-auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        let result = await response.json(); // Parse the JSON response

        // Check for validation errors
        if (result.errors) {
            if (result.errors.email) {
                registerEmailError.textContent = `• ${result.errors.email}`;
                registerEmail.style.border = "3px solid red";
            }
            if (result.errors.username) {
                registerUsernameError.textContent = `• ${result.errors.username}`;
                registerUsername.style.border = "3px solid red";
            }
            if (result.errors.password) {
                registerPasswordError.textContent = `• ${result.errors.password}`;
                registerPassword.style.border = "3px solid red";
            }
            if (registerPassword.value !== registerConfirmPassword.value) {
                registerConfirmPasswordError.textContent = "• Wachtwoorden komen niet overeen";
                registerConfirmPassword.style.border = "3px solid red";
            }
        }

        // If user registration is successful, redirect to the success page
        if (result.user) {
            window.location.href = "/pokemon-auth/register-success";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Event listener for email input
registerEmail.addEventListener("input", () => {
    if (registerEmail.value === "") {
        registerEmailLabel.style.color = "red";
        registerEmail.style.border = "3px solid red";
    } else {
        registerEmailLabel.style.color = "black";
        registerEmailError.textContent = "";
        registerEmail.style.border = "none";
    }
});

// Event listener for username input
registerUsername.addEventListener("input", () => {
    if (registerUsername.value === "") {
        registerUsernameLabel.style.color = "red";
        registerUsername.style.border = "3px solid red";
    } else {
        registerUsernameLabel.style.color = "black";
        registerUsernameError.textContent = "";
        registerUsername.style.border = "none";
    }
});

// Event listener for password input
registerPassword.addEventListener("input", () => {
    if (registerPassword.value.length < 8) {
        registerPasswordLabel.style.color = "red";
        registerPassword.style.border = "3px solid red";
    } else {
        registerPasswordLabel.style.color = "black";
        registerPasswordError.textContent = "";
        registerPassword.style.border = "none";
    }
});

// Event listener for confirm password input
registerConfirmPassword.addEventListener("input", () => {
    if (registerConfirmPassword.value !== registerPassword.value) {
        registerConfirmPasswordError.textContent = "• Wachtwoorden komen niet overeen";
        registerConfirmPassword.style.border = "3px solid red";
    } else {
        registerConfirmPasswordError.textContent = "";
        registerConfirmPassword.style.border = "none";
    }
});

// Toggle password visibility for register password
registerPasswordReveal.addEventListener("click", () => {
    if (registerPassword.type === "password") {
        registerPassword.type = "text";
        registerPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        registerPassword.type = "password";
        registerPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// Toggle password visibility for register confirm password
registerConfirmPasswordReveal.addEventListener("click", () => {
    if (registerConfirmPassword.type === "password") {
        registerConfirmPassword.type = "text";
        registerConfirmPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        registerConfirmPassword.type = "password";
        registerConfirmPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// Get form and input elements for the login process
const loginForm = document.getElementById("login-form"),
      userName = document.getElementById("loginUsername"),
      userNameError = document.getElementById("loginUsernameError"),
      userNameLabel = document.querySelector('label[for="loginUsername"]'),
      password = document.getElementById("loginPassword"),
      passwordError = document.getElementById("loginPasswordError"),
      passwordLabel = document.querySelector('label[for="loginPassword"]'),
      loginPasswordReveal = document.getElementById("loginPasswordReveal");

// Event listener for login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create a FormData object from the form
    let formData = new FormData(loginForm),
        data = Object.fromEntries(formData.entries()); // Convert FormData to a plain object

    // Clear any existing error messages
    userNameError.textContent = "";
    passwordError.textContent = "";

    try {
        // Send a POST request to login the user
        let response = await fetch("/pokemon-auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        let result = await response.json(); // Parse the JSON response

        // Check for validation errors
        if (result.errors) {
            if (result.errors.username) {
                userNameError.textContent = `• ${result.errors.username}`;
                userName.focus();
                userName.style.border = "3px solid red";
            }
            if (result.errors.password) {
                passwordError.textContent = `• ${result.errors.password}`;
                password.focus();
                password.style.border = "3px solid red";
            }
        }

        // If user login is successful, redirect to the submenu page
        if (result.user) {
            window.location.href = "/pokemon-submenu";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Event listener for username input on login
userName.addEventListener("input", () => {
    if (userName.value === "") {
        userNameLabel.style.color = "red";
        userName.style.border = "3px solid red";
    } else {
        userNameLabel.style.color = "black";
        userName.style.border = "none";
    }
});

// Event listener for password input on login
password.addEventListener("input", () => {
    if (password.value === "" || password.value.length < 8) {
        passwordLabel.style.color = "red";
        password.style.border = "3px solid red";
    } else {
        passwordLabel.style.color = "black";
        password.style.border = "none";
    }
});

// Toggle password visibility for login password
loginPasswordReveal.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        loginPasswordReveal.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        password.type = "password";
        loginPasswordReveal.innerHTML = '<i class="fas fa-eye"></i>';
    }
});
