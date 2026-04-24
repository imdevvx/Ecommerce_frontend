import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";
import { renderNavbar, updateCartCount } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";
import { createProductCard } from "../components/productCard.js";


/* ===================== STATE ===================== */
const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

const productGallery = document.querySelector(".product-gallery")

let selectedSize = null


/* ===================== SIZE SELECTION ===================== */
const initSizeSelection = () => {
    const sizeButtons = document.querySelectorAll(".size-btn")

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            selectedSize = btn.dataset.size
        })
    })
}


/* ===================== API ===================== */
const addToCart = async (productId, quantity) => {

    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            productId,
            size: selectedSize,
            quantity
        })
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.msg || "Failed to add to cart")
    }

    return data;
}


/* ===================== AUTH FLOW ===================== */
const handleAddToCartClick = async (productId, btnElement) => {
    const token = localStorage.getItem("token")

    if (!selectedSize) {
        showToast("Select a size", "info")
        return
    }

    if (!token) {
        localStorage.setItem("redirectAfterLogin", "add-to-cart")
        localStorage.setItem("pendingProductId", productId)
        localStorage.setItem("pendingQty", 1)
        localStorage.setItem("pendingSize", selectedSize)
        window.location.href = "signup.html"
        return
    }

    // 1. Set Loading State
    const originalText = btnElement.textContent;
    btnElement.disabled = true;
    btnElement.textContent = "Adding...";

    try {
        await addToCart(productId, 1)
        updateCartCount()
        showToast("Item added to cart", "cart")
        
        // Success state feedback
        btnElement.textContent = "Added!";
        setTimeout(() => {
            btnElement.disabled = false;
            btnElement.textContent = originalText;
        }, 2000);

    } catch (error) {
        showToast(error.message, "error")
        // Reset on error
        btnElement.disabled = false;
        btnElement.textContent = originalText;
    }
}


const handleAfterLogin = async () => {
    const token = localStorage.getItem("token")
    const pendingProductId = localStorage.getItem("pendingProductId")
    const pendingQty = localStorage.getItem("pendingQty")
    const pendingSize = localStorage.getItem("pendingSize")


    if (token && pendingProductId && pendingProductId === productId) {

        selectedSize = pendingSize

        try {
            await addToCart(pendingProductId, Number(pendingQty) || 1)
            updateCartCount()
            showToast("Item added to cart", "cart")
        }
        catch (error) {
            console.log(error.message, "error")
        }
        finally {
            localStorage.removeItem("redirectAfterLogin")
            localStorage.removeItem("pendingProductId")
            localStorage.removeItem("pendingQty")
            localStorage.removeItem("pendingSize")
        }
    }
}


/* ===================== RENDER PRODUCT DETAILS ===================== */
const renderProductDetails = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
            method: "GET",
            headers: { "Content-type": "application/json" }
        });
        const data = await res.json();
        const product = data.product;

        /* --- 1. Images Section --- */
        const productImages = document.createElement("div");
        productImages.classList.add("product-images");

        const thumbnailList = document.createElement("div");
        thumbnailList.classList.add("thumbnail-list");

        // Main Image Slider Wrapper
        const mainImageSlider = document.createElement("div");
        mainImageSlider.classList.add("main-image-slider");

        // The Scrollable Filmstrip
        const filmstrip = document.createElement("div");
        filmstrip.classList.add("filmstrip");

        // Create images for the filmstrip and thumbnails
        product.images.forEach((image, index) => {
            // Filmstrip Image
            const slideImg = document.createElement("img");
            slideImg.src = image;
            slideImg.alt = `Slide ${index + 1}`;
            filmstrip.append(slideImg);

            // Thumbnail Image
            const thumbImg = document.createElement("img");
            thumbImg.src = image;
            if (index === 0) thumbImg.classList.add("active");

            thumbImg.addEventListener("click", () => {
                // Scroll filmstrip to index
                const scrollAmount = filmstrip.clientWidth * index;
                filmstrip.scrollTo({ left: scrollAmount, behavior: "smooth" });

                // UI Update
                document.querySelectorAll(".thumbnail-list img").forEach(t => t.classList.remove("active"));
                thumbImg.classList.add("active");
            });
            thumbnailList.append(thumbImg);
        });

        // Loop Logic: Click main image to go to next (Infinite Loop)
        filmstrip.addEventListener("click", () => {
            const currentScroll = filmstrip.scrollLeft;
            const maxScroll = filmstrip.scrollWidth - filmstrip.clientWidth;

            if (currentScroll >= maxScroll - 10) {
                filmstrip.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                filmstrip.scrollBy({ left: filmstrip.clientWidth, behavior: "smooth" });
            }
        });

        // Sync Thumbnails on Swipe/Scroll
        filmstrip.addEventListener("scroll", () => {
            const index = Math.round(filmstrip.scrollLeft / filmstrip.clientWidth);
            const thumbs = document.querySelectorAll(".thumbnail-list img");
            thumbs.forEach(t => t.classList.remove("active"));
            if (thumbs[index]) thumbs[index].classList.add("active");
        });

        mainImageSlider.append(filmstrip);

        /* --- 2. Info Section --- */
        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");

        // Title Case Formatting for Name
        const rawName = `${product.color} ${product.category.name}'s ${product.name}`.toLowerCase();
        const formattedName = rawName.replace(/\b\w/g, s => s.toUpperCase());

        productInfo.innerHTML = `
            <h1 class="product-name">${formattedName}</h1>
            <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
            <p class="product-description">${product.description}</p>

            <div class="size-section">
                <p class="size-label">Select Size</p>
                <div class="size-options">
                    ${product.sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}
                </div>
            </div>
        `;

        const addToCartBtn = document.createElement("button");
        addToCartBtn.classList.add("add-to-cart-btn");
        addToCartBtn.textContent = "Add To Cart";

        productInfo.append(addToCartBtn);
        productImages.append(thumbnailList, mainImageSlider);
        productGallery.append(productImages, productInfo);

        // Event Listeners
        addToCartBtn.addEventListener("click", () => handleAddToCartClick(productId, addToCartBtn));
        initSizeSelection();
        renderRelatedProducts(product.category.slug, product.color, productId);

    } catch (error) {
        console.error("Render Error:", error.message);
    }
};


const renderRelatedProducts = async (category, color, currentProductId) => {

    try {
        const res = await fetch(`${API_BASE_URL}/product?category=${category}&color=${color}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
        const data = await res.json()
        console.log(data)
        const products = data.products
        console.log(products)

        if (!res.ok) {
            throw new Error(data.msg || "Error occured")
        }

        const relatedProducts = products.filter(product => {
            return product._id !== currentProductId
        })

        createProductCard(relatedProducts)

    }
    catch (error) {
        console.log(error.message)
    }
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderProductDetails()
    handleAfterLogin()
    renderFooter()
})
