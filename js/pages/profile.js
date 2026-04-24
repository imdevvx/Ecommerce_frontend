import { API_BASE_URL } from "../config/config.js"
import { renderNavbar } from "../components/navbar.js"
import { showToast } from "../components/toast.js"
import { renderFooter } from "../components/footer.js"

const profileCard = document.querySelector(".profile-card")
const profileAddressCard = document.querySelector(".profile-address-card")
const profileActions = document.querySelector(".profile-actions")


/* ======================= HELPERS ======================= */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
    })
}

/* ======================= LOGOUT ======================= */
const handleLogout = (logoutBtn) => {
    // 1. Loading state for logout
    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging out...";

    localStorage.removeItem("token");
    showToast("Logged out successfully", "info");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);
}

const renderUserDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // 2. Initial Loading state for the cards
    profileCard.innerHTML = `<p class="loading-text">Loading profile details...</p>`;
    profileAddressCard.innerHTML = `<p class="loading-text">Loading address...</p>`;

    try {
        // Fetch both simultaneously for better performance
        const [userRes, addressRes] = await Promise.all([
            fetch(`${API_BASE_URL}/auth/user`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }),
            fetch(`${API_BASE_URL}/address`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
        ]);

        const userData = await userRes.json();
        const addressData = await addressRes.json();
        
        const user = userData.user;
        const address = addressData.address;

        /* RENDER PROFILE CARD */
        profileCard.innerHTML = `
            <div class="profile-header">
                <div class="avatar">👤</div>
                <div>
                  <h2 class="user-name">${address ? address.fullName : user.email.split("@")[0]}</h2>
                  <p class="user-email">${user.email}</p>
                </div>
            </div>
            <div class="profile-details">
                ${address ? `
                <div class="detail-row">
                  <span>Phone</span>
                  <span>${address.phone}</span>
                </div>` : ""}
                <div class="detail-row">
                  <span>Joined</span>
                  <span>${formatDate(user.createdAt)}</span>
                </div>
            </div>`;

        /* RENDER ADDRESS CARD */
        if (!address) {
            profileAddressCard.innerHTML = `
                <div class="empty-address">
                  <p>No address saved</p>
                  <a href="address.html" class="link">Add Address</a>
                </div>`;
        } else {
            profileAddressCard.innerHTML = `
                <div class="section-header">
                    <h2>Saved Address</h2>
                    <a href="address.html" class="link">Edit</a>
                </div>
                <p class="address-name">${address.fullName}</p>
                <p>${address.addressLine}</p>
                <p>${address.city}, ${address.state} - ${address.pincode}</p>
                <p>📞 ${address.phone}</p>`;
        }

        /* ACTIONS */
        profileActions.innerHTML = "";
        const myOrders = document.createElement("a");
        myOrders.classList.add("action-btn");
        myOrders.href = "order.html";
        myOrders.textContent = "My Orders";

        const logoutBtn = document.createElement("button");
        logoutBtn.classList.add("action-btn", "logout");
        logoutBtn.textContent = "Logout";
        
        // Pass the button itself to handle the loading state
        logoutBtn.addEventListener("click", () => handleLogout(logoutBtn));

        profileActions.append(myOrders, logoutBtn);

    } catch (error) {
        showToast("Failed to load profile details", "error");
        profileCard.innerHTML = `<p class="error-text">Unable to load profile.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderUserDetails()
    renderFooter()
})