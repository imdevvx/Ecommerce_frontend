import { API_BASE_URL } from "../config/config.js"
import { showToast } from "../components/toast.js"


/* ======================= DOM ELEMENT ======================= */
const signupBtn = document.querySelector(".signup-btn")


/* ======================= SIGN UP ======================= */
const signup = async () => {
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        if (!email || !password) {
            throw new Error("Enter all the fields");
        }

        // 1. Lockdown UI
        const originalText = signupBtn.textContent;
        signupBtn.disabled = true;
        signupBtn.textContent = "Sending OTP...";
        emailInput.disabled = true;
        passwordInput.disabled = true;

        localStorage.setItem("email", email);

        const res = await fetch(`${API_BASE_URL}/auth/sendotp`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || "OTP not sent");
        }

        // 2. Success state
        signupBtn.textContent = "Redirecting...";
        showToast("OTP sent successfully", "success");

        setTimeout(() => {
            window.location.href = "verification.html";
        }, 1200);

    } catch (error) {
        showToast(error.message, "error");

        // 3. Restore UI on failure
        signupBtn.disabled = false;
        signupBtn.textContent = "Sign Up";
        emailInput.disabled = false;
        passwordInput.disabled = false;
    }
}

signupBtn.addEventListener("click", signup)