// ==========================================
// MUST APPLICATION PORTAL - FRONTEND LOGIC
// ==========================================

// Get the authentication views
const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");

// Switch between login and registration
function showView(viewName) {
    const showRegister = viewName === "register";

    loginView.hidden = showRegister;
    registerView.hidden = !showRegister;

    const heading = document.getElementById(
        showRegister ? "register-title" : "login-title"
    );

    heading.focus();
}

// Handle navigation buttons
document.querySelectorAll("[data-show]").forEach(button => {
    button.addEventListener("click", () => {
        showView(button.dataset.show);
    });
});

// Display messages
function displayMessage(elementId, message, success = false) {
    const element = document.getElementById(elementId);

    element.textContent = message;
    element.style.color = success ? "green" : "red";
}

// ==========================================
// STUDENT REGISTRATION
// ==========================================

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    const button = registerForm.querySelector("button[type='submit']");

    if (fullName.length < 2 || password.length < 8) {
        displayMessage(
            "register-message",
            "Please enter valid details. Password must have at least 8 characters."
        );
        return;
    }

    button.disabled = true;
    button.textContent = "CREATING ACCOUNT...";

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Registration failed.");
        }

        displayMessage(
            "register-message",
            result.message || "Account created successfully. You can now sign in.",
            true
        );

        registerForm.reset();

        // Switch to login after successful registration
        showView("login");

        document.getElementById("login-email").value = email;

    } catch (error) {
        displayMessage("register-message", error.message);

    } finally {
        button.disabled = false;
        button.innerHTML = 'CREATE ACCOUNT <span aria-hidden="true">→</span>';
    }
});

// ==========================================
// STUDENT LOGIN
// ==========================================

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const remember = loginForm.querySelector(
        "input[name='remember']"
    ).checked;

    const button = loginForm.querySelector("button[type='submit']");

    button.disabled = true;
    button.textContent = "SIGNING IN...";

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                remember
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Invalid login details.");
        }

        // Remember email only, never the password
        if (remember) {
            localStorage.setItem("must_student_email", email);
        } else {
            localStorage.removeItem("must_student_email");
        }

        displayMessage(
            "login-message",
            result.message || "Login successful!",
            true
        );

        // A dashboard page will be connected here later.

    } catch (error) {
        displayMessage("login-message", error.message);

    } finally {
        button.disabled = false;
        button.innerHTML = 'SIGN IN <span aria-hidden="true">→</span>';
    }
});

// ==========================================
// REMEMBER EMAIL
// ==========================================

const savedEmail = localStorage.getItem("must_student_email");

if (savedEmail) {
    document.getElementById("login-email").value = savedEmail;

    loginForm.querySelector("input[name='remember']").checked = true;
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

document.getElementById("forgot-link").addEventListener("click", (event) => {
    event.preventDefault();

    displayMessage(
        "login-message",
        "Password recovery is not yet configured. Please contact the portal administrator."
    );
});