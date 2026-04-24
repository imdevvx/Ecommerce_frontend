import { API_BASE_URL } from "../config/config.js"
import { showToast } from "../components/toast.js"


/* ======================= DOM ELEMENT ======================= */
const verifyBtn = document.querySelector(".verify-btn")

/* ======================= VERIFY ======================= */
const verify = async (e) => {
    e.preventDefault();

    const otpInput = document.querySelector("#otp");
    const email = localStorage.getItem("email");
    const otp = otpInput.value.trim();

    // Basic validation before fetch
    if (!otp) {
        showToast("Please enter the OTP", "info");
        return;
    }

    try {
        // 1. Lockdown UI
        const originalText = verifyBtn.textContent;
        verifyBtn.disabled = true;
        verifyBtn.textContent = "Verifying...";
        otpInput.disabled = true;

        const res = await fetch(`${API_BASE_URL}/auth/verifyotp`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || "OTP verification error");
        }

        if (data.token) {
            // 2. Success state
            verifyBtn.textContent = "Success!";
            localStorage.setItem("token", data.token);
            localStorage.removeItem("email");

            const action = localStorage.getItem("redirectAfterLogin");
            const productId = localStorage.getItem("pendingProductId");

            if (action === "add-to-cart" && productId) {
                showToast("Account verified! Adding item...", "success");
                setTimeout(() => {
                    window.location.href = `product-gallery.html?productId=${productId}`;
                }, 1500);
                return;
            }

            showToast("Welcome to DVL!", "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        }

    } catch (error) {
        showToast(error.message, "error");

        // 3. Restore UI on failure
        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify";
        otpInput.disabled = false;
    }
}

verifyBtn.addEventListener("click", verify)