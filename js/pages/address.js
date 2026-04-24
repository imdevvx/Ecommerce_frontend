import { API_BASE_URL } from "../config/config.js"
import { renderNavbar } from "../components/navbar.js";
import { showToast } from "../components/toast.js";


const addressForm = document.querySelector("#address-form")


/* ======================= EDIT ADDRESS IF ADDRESS EXIST ======================= */
let hasAddress = false;
const loadAddressIfExist = async () => {

    const token = localStorage.getItem("token")
    if (!token) return

    try {
        const res = await fetch(`${API_BASE_URL}/address`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (!res.ok) return; // no address

        const data = await res.json()
        const address = data.address

        hasAddress = true

        // Prefill form
        document.querySelector("#fullName").value = address.fullName
        document.querySelector("#phone").value = address.phone
        document.querySelector("#addressLine").value = address.addressLine
        document.querySelector("#city").value = address.city
        document.querySelector("#state").value = address.state
        document.querySelector("#pincode").value = address.pincode

        document.querySelector(".address-title").textContent = "Edit Address"
    }
    catch (error) {
        console.log(error.message)
    }

}


/* ======================= SUBMIT ADDRESS ======================= */
const submitAddressForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Select the button and store original text
    const submitBtn = document.querySelector("#save-address-btn");
    const originalBtnText = submitBtn.textContent;

    if (!token) {
        window.location.href = "signup.html";
        return;
    }

    const fullName = document.querySelector("#fullName").value;
    const phone = document.querySelector("#phone").value;
    const addressLine = document.querySelector("#addressLine").value;
    const city = document.querySelector("#city").value;
    const state = document.querySelector("#state").value;
    const pincode = document.querySelector("#pincode").value;

    try {
        // 1. Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving Address...";

        const res = await fetch(`${API_BASE_URL}/address`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fullName,
                phone,
                addressLine,
                city,
                state,
                pincode
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.msg || "Something went wrong");
        }

        const redirect = localStorage.getItem("redirectAfterAddress");

        showToast("Address saved successfully", "success");

        setTimeout(() => {
            if (redirect === "checkout") {
                window.location.href = "checkout.html";
            } else {
                window.location.href = "profile.html";
            }
            localStorage.removeItem("redirectAfterAddress");
        }, 1500);

    } catch (error) {
        showToast(error.message, "error");
        console.log(error.message);

        // 2. Restore button only on error (on success we redirect anyway)
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
};


document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    loadAddressIfExist()
})

addressForm.addEventListener("submit", submitAddressForm)
