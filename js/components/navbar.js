import { API_BASE_URL } from "../config/config.js"

const navbarContainer = document.querySelector("#navbar")

export const renderNavbar = async () => {
    const token = localStorage.getItem("token")
    navbarContainer.innerHTML = `
    <div class="navbar">
        <a class="logo" href="index.html">DVL</a>

        <div class="nav-right">
            <a href="cart.html" class="cart">
                CART <span class="cart-count" id="cart-count">0</span>
            </a>
            
            <nav class="desktop-nav">
                <a href="index.html">HOME</a>
                <a href="order.html">ORDERS</a>
                <a href="${token ? "profile.html" : "login.html"}">
                    ${token ? "ACCOUNT" : "LOGIN"}
                </a>
            </nav>

            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
            </div>
        </div>
    </div>

    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="close-btn" id="close-sidebar">&times;</div>
        </div>
        <nav class="sidebar-links">
            <a href="index.html">HOME</a>
            <a href="order.html">ORDERS</a>
            <a href="${token ? "profile.html" : "login.html"}">
                ${token ? (token ? "ACCOUNT" : "LOGIN") : "LOGIN"}
            </a>
        </nav>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    `

    // Hamburger Logic
    const hamburger = document.querySelector("#hamburger");
    const sidebar = document.querySelector("#sidebar");
    const overlay = document.querySelector("#sidebar-overlay");
    const closeBtn = document.querySelector("#close-sidebar");

    const toggleSidebar = () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    };

    hamburger.addEventListener("click", toggleSidebar);
    closeBtn.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    if (token) {
        updateCartCount()
    }


}

export const updateCartCount = async () => {
    const token = localStorage.getItem("token")
    if (!token) return null;
    try {
        const res = await fetch(`${API_BASE_URL}/cart/total`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await res.json()
        const countEl = document.querySelector("#cart-count")
        if (countEl) {
            countEl.textContent = data.totalQuantity || 0
        }
        return data;
    } catch (error) {
        console.log("Failed to fetch cart total", error.message)
        return null;
    }
}