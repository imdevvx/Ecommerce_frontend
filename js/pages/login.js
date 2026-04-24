import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";

if (localStorage.getItem("redirectAfterPasswordReset")) {
    showToast("Login to your DVL account", "info")
    localStorage.removeItem("redirectAfterPasswordReset")
}

/* ======================= DOM ELEMENT ======================= */
const loginBtn = document.querySelector(".login-btn")


/* ======================= LOGIN ======================= */
const login = async () => {
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        if (!email || !password) {
            throw new Error("Enter all the fields");
        }

        // 1. Disable button and inputs, show loading state
        const originalText = loginBtn.textContent;
        loginBtn.disabled = true;
        loginBtn.textContent = "Verifying...";
        emailInput.disabled = true;
        passwordInput.disabled = true;

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            // Restore UI so user can fix credentials
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
            emailInput.disabled = false;
            passwordInput.disabled = false;
            throw new Error(data.msg || "Something went wrong");
        }

        // 2. Success logic
        const token = data.token;
        localStorage.setItem("token", token);

        const pendingProductId = localStorage.getItem("pendingProductId");

        if (pendingProductId) {
            window.location.href = `product-gallery.html?productId=${pendingProductId}`;
            localStorage.removeItem("pendingProductId"); // Clean up
            return;
        }

        showToast("Logged in successfully", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

    } catch (error) {
        // Use error message directly for the toast
        showToast(error.message || error, "error");
    }
}


loginBtn.addEventListener("click", login)

