import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";


/* ======================= STATE ======================= */
const params = new URLSearchParams(window.location.search);
const email = params.get("email");


/* ======================= DOM ELEMENT ======================= */
const resetPassBtn = document.querySelector(".reset-pass-btn")


/* ======================= RESET PASSWORD ======================= */
const resetPass = async () => {
    const otpInput = document.querySelector("#otp");
    const passwordInput = document.querySelector("#password");

    const otp = otpInput.value;
    const password = passwordInput.value;

    try {
        if (!password || !otp) {
            throw new Error("Enter all the fields");
        }

        // 1. Lockdown UI
        const originalText = resetPassBtn.textContent;
        resetPassBtn.disabled = true;
        otpInput.disabled = true;
        passwordInput.disabled = true;

        // Step 1: Verify OTP
        resetPassBtn.textContent = "Verifying OTP...";
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Invalid OTP");

        // Step 2: Reset Password
        resetPassBtn.textContent = "Updating Password...";
        const ress = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                email,
                otp,
                newPassword: password
            })
        });

        if (ress.ok) {
            resetPassBtn.textContent = "Success!";
            showToast('Password updated successfully', "success");

            localStorage.removeItem("email");
            localStorage.setItem("redirectAfterPasswordReset", "login");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } else {
            const errorData = await ress.json();
            throw new Error(errorData.msg || "Failed to reset password");
        }

    } catch (error) {
        showToast(error.message, "error");

        // 2. Restore UI on failure
        resetPassBtn.disabled = false;
        resetPassBtn.textContent = "Continue";
        otpInput.disabled = false;
        passwordInput.disabled = false;
    }
}


resetPassBtn.addEventListener("click", resetPass)