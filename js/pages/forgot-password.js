import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";


/* ======================= DOM ELEMENT ======================= */
const sendOTPBtn = document.querySelector(".forgot-pass-otp-btn")


/* ======================= SEND FORGOT PASSWORD OTP ======================= */
const sendForgotPassOTP = async () => {
    const emailInput = document.querySelector("#email");
    const email = emailInput.value;

    // Simple validation check
    if (!email) {
        showToast("Please enter a valid email address", "warning");
        return;
    }

    // 1. Disable button and update text
    const originalText = sendOTPBtn.textContent;
    sendOTPBtn.disabled = true;
    sendOTPBtn.textContent = "Sending OTP...";
    emailInput.disabled = true; // Lock email input while sending

    try {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
            showToast("OTP for password reset sent successfully", "info");
            setTimeout(() => {
                window.location.href = `reset-password.html?email=${encodeURIComponent(email)}`;
            }, 1500);
        } else {
            throw new Error(data.msg || "Failed to send OTP");
        }
    }
    catch (error) {
        showToast(error.message, "error");

        // 2. Restore button and input only on error
        sendOTPBtn.disabled = false;
        sendOTPBtn.textContent = originalText;
        emailInput.disabled = false;
    }
}

sendOTPBtn.addEventListener("click", sendForgotPassOTP)