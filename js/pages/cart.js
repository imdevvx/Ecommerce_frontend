// import { API_BASE_URL } from "./config.js"
// import { renderNavbar } from "./navbar.js"
// import { updateCartCount } from "./navbar.js";
// import { showToast } from "./toast.js";

// /* ======================= DOM ELEMENTS ======================= */
// const cartContainer = document.querySelector("#cart-container")
// const cartSummary = document.querySelector(".cart-summary")

// const productContainer = document.querySelector("#products-container")
// const recommendedProducts = document.querySelector(".recommended-products")


// const renderProducts = async () => {

//     try {
//         const res = await fetch(`${API_BASE_URL}/product`, {
//             method: "GET",
//             headers: {
//                 "Content-type": "application/json"
//             }
//         })

//         const data = await res.json()
//         const products = await data.products
//         console.log(data)
//         console.log(products)

//         productContainer.innerHTML = ""

//         const heading = document.createElement("h2")
//         heading.classList.add("explore-heading")
//         heading.textContent = "Explore Our Products"

//         recommendedProducts.append(heading)

//         products.forEach((product) => {
//             const productDetailsLink = document.createElement("a")
//             productDetailsLink.href = `product-gallery.html?productId=${product._id}`
//             productDetailsLink.classList.add("product-details-link")

//             const productCard = document.createElement("div")
//             productCard.classList.add("product-card")

//             const productImg = document.createElement("img")
//             const thumbImage = product.images[0]
//             productImg.src = thumbImage

//             const productInfo = document.createElement("div")
//             productInfo.classList.add("product-info")

//             const productName = document.createElement("h3")
//             productName.textContent = `${product.color} ${product.category.name}'s ${product.name}`

//             const productPrice = document.createElement("p")
//             productPrice.classList.add("price")
//             productPrice.textContent = `₹${product.price}`

//             const quickViewBtn = document.createElement("button")
//             quickViewBtn.classList.add("addToCart")
//             quickViewBtn.textContent = "Quick View"

//             productInfo.append(productName, productPrice, quickViewBtn)
//             productCard.append(productImg, productInfo)
//             productDetailsLink.append(productCard)
//             productContainer.append(productDetailsLink)

//             quickViewBtn.addEventListener("click", () => {
//                 window.location.href = `product-gallery.html?productId=${product._id}`
//             })
//         })
//     }
//     catch (error) {
//         alert(error.message)
//         console.log(error)
//     }
// }

// /* ======================= EMPTY CART UI ======================= */
// const emptyCart = () => {
//     cartContainer.innerHTML =
//     `
//     <div class="empty-cart">
//       <p>Your cart is empty</p>
//       <a href="index.html">Go to products</a>
//     </div>
//   `
// }


// /* ======================= QUANTITY HANDLERS ======================= */
// const handleDecreaseBtnClick = async (qty, product, size, decreaseButton) => {

//     const token = localStorage.getItem("token")
//     const currentQty = Number(qty.textContent)
//     const newQty = currentQty - 1
//     if (newQty < 0) return;

//     decreaseButton.disabled = true;

//     try {
//         await fetch(`${API_BASE_URL}/cart/update`, {
//             method: "PUT",
//             headers: {
//                 "Content-type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 productId: product._id,
//                 size,
//                 quantity: newQty
//             })
//         })

//         updateCartCount()
//         renderCart()

//     }
//     catch (error) {
//         console.log(error.message)
//     }
//     finally {
//         decreaseButton.disabled = false
//     }
// }


// const handleIncreaseBtnClick = async (qty, product, size, increaseButton) => {

//     const token = localStorage.getItem("token")
//     const currentQty = Number(qty.textContent)
//     const newQty = currentQty + 1

//     increaseButton.disabled = true;

//     try {
//         await fetch(`${API_BASE_URL}/cart/update`, {
//             method: "PUT",
//             headers: {
//                 "Content-type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 productId: product._id,
//                 size,
//                 quantity: newQty
//             })
//         })

//         updateCartCount()
//         renderCart()

//     }
//     catch (error) {
//         console.log(error.message)
//     }
//     finally {
//         increaseButton.disabled = false
//     }
// }


// /* ======================= REMOVE ITEM HANDLER ======================= */
// const handleRemoveBtnClick = async (product, size, removeButton) => {
//     const token = localStorage.getItem("token")

//     removeButton.disabled = true

//     try {
//         await fetch(`${API_BASE_URL}/cart/remove/${product._id}`, {
//             method: "DELETE",
//             headers: {
//                 "Content-type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 size
//             })
//         })

//         updateCartCount()
//         showToast("Item Removed")
//         renderCart()

//     }
//     catch (error) {
//         console.log(error.message)
//     }
//     finally {
//         removeButton.disabled = false
//     }
// }


// /* ======================= CART ITEM COMPONENT ======================= */
// const CartItem = (data) => {
//     const { product, size } = data

//     const cartItem = document.createElement("div")
//     cartItem.classList.add("cart-item")

//     cartItem.innerHTML =
//         /* ITEM IMAGE */
//         `
//     <a class="product-gallery-link" href=product-gallery.html?productId=${product._id}>
//         <img class="cart-item-image" src=${product.images[0]} alt="Product image">
//     </a>
//     `

//     const cartItemDetails = document.createElement("div")
//     cartItemDetails.classList.add("cart-item-details")

//     cartItemDetails.innerHTML =
//         /* CART ITEM HEADER  */
//         `
//     <div class="cart-item-header">
//         <a class="product-gallery-link" href=product-gallery.html?productId=${product._id}>
//             <h3 class="cart-item-name">${product.color} ${product.category.name}'s ${product.name}</h3>
//         </a>
//         <p class="cart-item-price">₹${product.price}</p>
//     </div>

//     <p class="cart-item-size">Size: <span>${data.size}</span></p>
//     <p class="cart-item-description">${product.description}</p>
//     `

//     /* CART ITEM ACTIONS */
//     const cartItemActions = document.createElement("div")
//     cartItemActions.classList.add("cart-item-actions")

//     const quantityControls = document.createElement("div")
//     quantityControls.classList.add("quantity-controls")

//     const decreaseButton = document.createElement("button")
//     decreaseButton.classList.add("qty-btn")
//     decreaseButton.textContent = "-"

//     const qty = document.createElement("span")
//     qty.classList.add("qty")
//     qty.textContent = data.quantity

//     const increaseButton = document.createElement("button")
//     increaseButton.classList.add("qty-btn")
//     increaseButton.textContent = "+"

//     const removeButton = document.createElement("button")
//     removeButton.classList.add("remove-btn")
//     removeButton.textContent = "Remove"

//     /* APPENDING */
//     quantityControls.append(decreaseButton, qty, increaseButton)
//     cartItemActions.append(quantityControls, removeButton)
//     cartItemDetails.append(cartItemActions)
//     cartItem.append(cartItemDetails)

//     decreaseButton.addEventListener("click", () => {
//         handleDecreaseBtnClick(qty, product, size, decreaseButton)
//     })

//     increaseButton.addEventListener("click", () => {
//         handleIncreaseBtnClick(qty, product, size, increaseButton)
//     })

//     removeButton.addEventListener("click", () => {
//         handleRemoveBtnClick(product, size, removeButton)
//     })

//     return cartItem
// }


// /* ======================= CHECKOUT ======================= */
// const handleCheckoutBtnClick = async () => {
//     window.location.href = "checkout.html"
// }


// /* ======================= CART SUMMARY ======================= */
// const CartSummary = (cartTotals) => {

//     if (!cartTotals || cartTotals.totalQuantity === 0) {
//         return
//     }

//     cartSummary.innerHTML =
//         `
//     <div class="summary-row">
//         <span>Total Items</span>
//         <span id="total-items">${cartTotals.totalQuantity}</span>
//     </div>

//     <div class="summary-row">
//         <span>Total Price</span>
//         <span id="total-price">₹${cartTotals.totalPrice}</span>
//     </div>

//     <div class="summary-row delivery-free">
//         <span>Delivery Fee</span>
//         <span>FREE</span>
//     </div>
//     `

//     const checkoutButton = document.createElement("button")
//     checkoutButton.id = "checkout-btn"
//     checkoutButton.textContent = "Proceed to Checkout"

//     cartSummary.append(checkoutButton)

//     checkoutButton.addEventListener("click", handleCheckoutBtnClick)
// }


// /* ======================= RENDER CART ======================= */
// const renderCart = async () => {

//     cartContainer.innerHTML = ""
//     cartSummary.innerHTML = ""

//     const token = localStorage.getItem("token")

//     try {
//         const cartDataResponse = await fetch(`${API_BASE_URL}/cart`, {
//             method: "GET",
//             headers: {
//                 "Content-type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         })

//         const cartTotalsResponse = await fetch(`${API_BASE_URL}/cart/total`, {
//             method: "GET",
//             headers: {
//                 "Content-type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         })

//         const cartData = await cartDataResponse.json()
//         const cartItems = cartData.cart.items
//         console.log(cartData)
//         console.log(cartItems)

//         const cartTotals = await cartTotalsResponse.json()
//         console.log(cartTotals)

//         if (cartData.cart.items.length === 0) {
//             emptyCart()
//             renderProducts()
//             return
//         }

//         cartData.cart.items.forEach(item => {
//             cartContainer.append(CartItem(item))
//         })

//         CartSummary(cartTotals)
//     }
//     catch (error) {
//         alert(error.message)
//     }
// }


// /* ======================= INIT ======================= */
// document.addEventListener("DOMContentLoaded", () => {
//     renderNavbar()
//     renderCart()
// }
// )































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
    const { product, size, quantity } = data
    const cartItem = document.createElement("div")
    cartItem.classList.add("cart-item")

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
              <button class="qty-btn">-</button>
              <span class="qty">${quantity}</span>
              <button class="qty-btn">+</button>
            </div>
            <button class="remove-btn">Remove</button>
          </div>
        </div>`

    const qtyEl = cartItem.querySelector(".qty")
    const [decBtn, incBtn] = cartItem.querySelectorAll(".qty-btn")
    const removeBtn = cartItem.querySelector(".remove-btn")

    decBtn.onclick = async () => {
        const prev = Number(qtyEl.textContent)
        const newQty = prev - 1

        if (newQty < 0) return;

        decBtn.disabled = true;

        try {
            await updateCartAPI(product._id, size, prev - 1)

            if (newQty === 0) {
                cartItem.classList.add("removing")

                setTimeout(() => {
                    cartItem.remove()
                    if (cartContainer.children.length === 0) {
                        cartSummary.innerHTML = ""
                        emptyCart()
                        renderProducts()

                        recommendedProducts.style.display = "block"
                        
                        window.addEventListener("scroll", handleInfiniteScroll)
                    }
                    refreshCartTotals()
                }, 200)
            }
            else {
                qtyEl.textContent = newQty
                refreshCartTotals() // Updates Nav + Summary
            }
        }
        catch (error) {
            qtyEl.textContent = prev
            showToast("Update failed", "error")
        }
        finally {
            decBtn.disabled = false;
        }
    }

    incBtn.onclick = async () => {
        const prev = Number(qtyEl.textContent)

        if (qtyEl.textContent >= 6) {
            showToast("Maximum quantity reached", "warning")
            return
        }

        try {
            qtyEl.textContent = prev + 1
            await updateCartAPI(product._id, size, prev + 1)
            refreshCartTotals()
        } catch {
            qtyEl.textContent = prev
            showToast("Update failed", "error")
        }
    }

    removeBtn.onclick = async () => {
        const parent = cartItem.parentNode;

        try {
            // 1. Start the visual animation immediately
            cartItem.classList.add("removing");

            // 2. Perform the API call
            await removeItemAPI(product._id, size);

            // 3. Wait for the CSS transition to finish before removing from DOM
            // 400ms matches the CSS transition time
            setTimeout(() => {
                showToast("Item removed", "neutral");
                cartItem.remove();

                // Check if cart is now empty
                if (!parent || parent.children.length === 0) {
                    cartSummary.innerHTML = "";
                    emptyCart();
                    renderProducts();

                    recommendedProducts.style.display = "block"

                    window.addEventListener("scroll", handleInfiniteScroll)
                }

                // 4. Update the Navbar and Summary
                refreshCartTotals();
            }, 600);

        } catch (err) {
            // Rollback: if the API fails, bring the item back
            cartItem.classList.remove("removing");
            showToast("Failed to remove item", "error");
        }
    };
    return cartItem
}

/* ======================= CART SUMMARY ======================= */
const CartSummary = (totals) => {
    if (!totals || totals.totalQuantity === 0) {
        cartSummary.innerHTML = ""
        return
    }

    cartSummary.innerHTML = `
        <div class="summary-row"><span>Total Items</span><span>${totals.totalQuantity}</span></div>
        <div class="summary-row"><span>Total Price</span><span>₹${totals.totalPrice}</span></div>
        <div class="summary-row delivery-free"><span>Delivery</span><span>FREE</span></div>
        <button id="checkout-btn">Proceed to Checkout</button>`

    cartSummary.querySelector("#checkout-btn").onclick = () => {
        window.location.href = "checkout.html"
    }
}


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

