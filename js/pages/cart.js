import { API_BASE_URL } from "../config/config.js"
import { renderNavbar, updateCartCount } from "../components/navbar.js"
import { showToast } from "../components/toast.js"
import { renderFooter } from "../components/footer.js"
import { createProductCard } from "../components/productCard.js"

/* ======================= DOM ELEMENTS ======================= */
const cartContainer = document.querySelector("#cart-container")
const cartSummary = document.querySelector(".cart-summary")
const productContainer = document.querySelector("#products-container")
const recommendedProducts = document.querySelector(".recommended-products")

/* ======================= REFRESH LOGIC ======================= */
// This updates BOTH the Navbar and the Summary box in one go
const refreshCartTotals = async () => {
    const totals = await updateCartCount();
    if (totals) {
        CartSummary(totals);
    }
}

/* ======================= EMPTY CART ======================= */
const emptyCart = () => {
    cartContainer.innerHTML = `
    <div class="empty-cart-state">
      <div class="empty-cart-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap round="round">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>It looks like you haven't added anything to your cart yet. Explore our latest denim arrivals to get started.</p>
      <div class="empty-cart-actions">
        <a href="index.html" class="primary-btn">Shop New Arrivals</a>
        <a href="index.html" class="secondary-link">Back to Home</a>
      </div>
    </div>`
}


let currentPage = 1
const limit = 4
let isLoading = false
let hasMore = true


/* ======================= RENDER PRODUCTS (WHEN EMPTY) ======================= */
const renderProducts = async () => {

    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await fetch(`${API_BASE_URL}/product?page=${currentPage}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })

        const data = await res.json()
        const products = data.products
        console.log(data)
        console.log(products)

        if (!res.ok) {
            throw new Error(data.msg || "Error")
        }

        if (products.length < limit) {
            hasMore = false // no more products
        }

        createProductCard(products)
        currentPage++;
    }
    catch (error) {
        console.log(error.message, "error")
    }
    finally {
        isLoading = false;
    }
}


/* ======================= API HELPERS ======================= */
const updateCartAPI = async (productId, size, quantity) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, size, quantity })
    })
    if (!res.ok) throw new Error("Update failed")
}

const removeItemAPI = async (productId, size) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ size })
    })
    if (!res.ok) throw new Error("Remove failed")
}

/* ======================= CART ITEM ======================= */
const CartItem = (data) => {
    const { product, size, quantity } = data;
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
        <a href="product-gallery.html?productId=${product._id}">
          <img class="cart-item-image" src="${product.images[0]}" />
        </a>
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h3 class="cart-item-name">${product.color} ${product.category.name}'s ${product.name}</h3>
            <p class="cart-item-price">₹${product.price}</p>
          </div>
          <p class="cart-item-size">Size: ${size}</p>
          <p class="cart-item-description">${product.description}</p>
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="qty-btn" aria-label="Decrease">−</button>
              <span class="qty">${quantity}</span>
              <button class="qty-btn" aria-label="Increase">+</button>
            </div>
            <button class="remove-btn">Remove</button>
          </div>
        </div>`;

    const qtyEl = cartItem.querySelector(".qty");
    const [decBtn, incBtn] = cartItem.querySelectorAll(".qty-btn");
    const removeBtn = cartItem.querySelector(".remove-btn");

    // Helper to toggle state for all controls in this item
    const setItemLoading = (isLoading) => {
        decBtn.disabled = isLoading;
        incBtn.disabled = isLoading;
        removeBtn.disabled = isLoading;
        cartItem.style.opacity = isLoading ? "0.7" : "1";
    };

    decBtn.onclick = async () => {
        const prev = Number(qtyEl.textContent);
        const newQty = prev - 1;
        if (newQty < 0) return;

        setItemLoading(true);
        try {
            await updateCartAPI(product._id, size, newQty);
            if (newQty === 0) {
                cartItem.classList.add("removing");
                setTimeout(() => {
                    cartItem.remove();
                    if (cartContainer.children.length === 0) {
                        cartSummary.innerHTML = "";
                        emptyCart();
                        renderProducts();
                    }
                    refreshCartTotals();
                }, 400);
            } else {
                qtyEl.textContent = newQty;
                await refreshCartTotals();
            }
        } catch (error) {
            showToast("Update failed", "error");
        } finally {
            setItemLoading(false);
        }
    };

    incBtn.onclick = async () => {
        const prev = Number(qtyEl.textContent);
        if (prev >= 6) {
            showToast("Maximum quantity reached", "warning");
            return;
        }

        setItemLoading(true);
        try {
            await updateCartAPI(product._id, size, prev + 1);
            qtyEl.textContent = prev + 1;
            await refreshCartTotals();
        } catch (error) {
            showToast("Update failed", "error");
        } finally {
            setItemLoading(false);
        }
    };

    removeBtn.onclick = async () => {
        setItemLoading(true);
        removeBtn.textContent = "Removing...";
        try {
            await removeItemAPI(product._id, size);
            cartItem.classList.add("removing");
            setTimeout(() => {
                showToast("Item removed", "neutral");
                cartItem.remove();
                if (cartContainer.children.length === 0) {
                    cartSummary.innerHTML = "";
                    emptyCart();
                    renderProducts();
                }
                refreshCartTotals();
            }, 400);
        } catch (err) {
            removeBtn.textContent = "Remove";
            setItemLoading(false);
            showToast("Failed to remove item", "error");
        }
    };

    return cartItem;
};

/* ======================= CART SUMMARY ======================= */
const CartSummary = (totals) => {
    if (!totals || totals.totalQuantity === 0) {
        cartSummary.innerHTML = "";
        return;
    }

    cartSummary.innerHTML = `
        <div class="summary-row"><span>Total Items</span><span>${totals.totalQuantity}</span></div>
        <div class="summary-row"><span>Total Price</span><span>₹${totals.totalPrice}</span></div>
        <div class="summary-row delivery-free"><span>Delivery</span><span>FREE</span></div>
        <button id="checkout-btn">Proceed to Checkout</button>`;

    const checkoutBtn = cartSummary.querySelector("#checkout-btn");
    checkoutBtn.onclick = () => {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Processing...";
        checkoutBtn.style.backgroundColor = "#444";

        // Brief delay for UX so user sees the "Processing" state
        setTimeout(() => {
            window.location.href = "checkout.html";
        }, 500);
    };
};


const handleInfiniteScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        renderProducts()
    }
}


/* ======================= RENDER CART ======================= */
const renderCart = async () => {
    cartContainer.innerHTML = "Loading..."
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            emptyCart()
            renderProducts()
            recommendedProducts.style.display = "block"
            window.addEventListener("scroll", handleInfiniteScroll)
            return
        }
        const res = await fetch(`${API_BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        cartContainer.innerHTML = ""
        window.removeEventListener("scroll", handleInfiniteScroll)

        if (!data.cart.items || data.cart.items.length === 0) {
            emptyCart()
            renderProducts()

            recommendedProducts.style.display = "block"

            window.addEventListener("scroll", handleInfiniteScroll)
            return
        }

        recommendedProducts.style.display = "none"

        data.cart.items.forEach(item => cartContainer.append(CartItem(item)))
        refreshCartTotals()
    } catch (err) {
        showToast("Failed to load cart", "error")
    }
}

/* ======================= INIT ======================= */
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderCart()
    renderFooter()
})

