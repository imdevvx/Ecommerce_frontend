import { API_BASE_URL } from "../config/config.js";
import { renderNavbar } from "../components/navbar.js";
import { showToast } from "../components/toast.js";
import { renderFooter } from "../components/footer.js";

/* ================= STATE ================= */
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");


/* ================= FORMAT DATE ================= */
const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};


const customConfirm = () => {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirm-modal");
        const confirmBtn = document.getElementById("modal-confirm");
        const cancelBtn = document.getElementById("modal-cancel");

        modal.style.display = "flex"

        const cleanup = (value) => {
            modal.style.display = "none";
            resolve(value)
        }

        confirmBtn.onclick = () => cleanup(true);
        cancelBtn.onclick = () => cleanup(false);
        // Optional: Close on overlay click
        modal.onclick = (e) => { if (e.target === modal) cleanup(false); };
    })
}


const handleCancelOrder = async (orderId) => {
    const isConfirmed = await customConfirm();
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    // 1. Target the button inside the modal for the loading state
    const modalConfirmBtn = document.getElementById("modal-confirm");
    const modalCancelBtn = document.getElementById("modal-cancel");
    const originalText = modalConfirmBtn.textContent;

    try {
        // Disable both buttons in modal to prevent interaction during fetch
        modalConfirmBtn.disabled = true;
        modalCancelBtn.disabled = true;
        modalConfirmBtn.textContent = "Cancelling...";

        const res = await fetch(`${API_BASE_URL}/order/${orderId}/cancel`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.msg || "Failed to cancel order");
        }

        modalConfirmBtn.textContent = "Cancelled";
        showToast("Order cancelled successfully", "success");

        // Close modal after a short delay before reloading
        setTimeout(() => {
            document.getElementById("confirm-modal").style.display = "none";
            window.location.reload();
        }, 1500);

    } catch (error) {
        showToast(error.message, "error");

        // 2. Reset modal state on error so user can try again or close
        modalConfirmBtn.disabled = false;
        modalCancelBtn.disabled = false;
        modalConfirmBtn.textContent = originalText;
    }
}


/* ================= RENDER ORDER DETAILS ================= */
const renderOrderDetails = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "signup.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/order/${orderId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        const order = data.order;
        console.log(data)
        console.log(order);

        /* ROOT CONTAINER */
        const container = document.querySelector(".order-details");
        container.innerHTML = "";


        /* ================= ORDER HEADER ================= */
        const orderHeader = document.createElement("div");
        orderHeader.classList.add("order-header");

        const headerLeft = document.createElement("div");

        const orderTitle = document.createElement("h2");
        orderTitle.classList.add("order-id")
        orderTitle.textContent = `Order #${order._id}`;

        const orderDate = document.createElement("p");
        orderDate.classList.add("order-date");

        const orderStatus = document.createElement("span");
        orderStatus.classList.add("order-status");

        if (order.status === "Delivered") {
            orderStatus.textContent = "Delivered";
            orderStatus.classList.add("delivered");
            orderDate.textContent = `Delivered on ${formatDate(order.deliveredAt)}`;
        } else if (order.status === "Shipped") {
            orderStatus.textContent = "Shipped";
            orderStatus.classList.add("shipped");
            orderDate.textContent = `Shipped on ${formatDate(order.shippedAt)}`;
        } else if (order.status === "Pending") {
            orderStatus.textContent = "Pending";
            orderStatus.classList.add("pending");
            orderDate.textContent = `Placed on ${formatDate(order.createdAt)}`;
        } else {
            orderStatus.textContent = "Cancelled";
            orderStatus.classList.add("cancelled");
            orderDate.textContent = `Cancelled on ${formatDate(order.cancelledAt)}`;
        }

        headerLeft.append(orderTitle, orderDate);
        orderHeader.append(headerLeft, orderStatus);


        /* ================= TIMELINE ================= */
        const orderTimeline = document.createElement("div");
        orderTimeline.classList.add("order-timeline");

        const steps = order.status === "Cancelled" ? ["Placed", "Cancelled"] : ["Placed", "Shipped", "Delivered"]

        steps.forEach(stepText => {
            const step = document.createElement("div");
            step.classList.add("timeline-step");
            step.textContent = stepText;

            if (order.status === "Cancelled") {
                step.classList.add("cancelled-step") // Highlight red
            }

            else {
                if (
                    stepText === "Placed" ||
                    (stepText === "Shipped" && ["Shipped", "Delivered"].includes(order.status)) ||
                    (stepText === "Delivered" && order.status === "Delivered")
                ) {
                    step.classList.add("completed");
                }
            }
            orderTimeline.append(step);
        });


        /* ================= ITEMS ================= */
        const itemsSection = document.createElement("div");
        itemsSection.classList.add("order-items");

        order.items.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.classList.add("order-item");

            const productDetailsLink = document.createElement("a")
            productDetailsLink.href = `product-gallery.html?productId=${item.productId}`


            const img = document.createElement("img");
            img.src = item.images[0];

            productDetailsLink.append(img)

            const info = document.createElement("div");
            info.classList.add("item-info");

            const itemName = document.createElement("p");
            itemName.classList.add("item-name");
            itemName.textContent = item.productName;

            const itemSize = document.createElement("p")
            itemSize.classList.add("item-size")
            itemSize.innerHTML = `Size <span>${item.size}</span>`

            const itemQty = document.createElement("p");
            itemQty.classList.add("item-qty");
            itemQty.textContent = `Qty: ${item.quantity}`;

            info.append(itemName, itemSize, itemQty);

            const itemPrice = document.createElement("p");
            itemPrice.classList.add("item-price");
            itemPrice.textContent = `₹${item.price * item.quantity}`;

            itemRow.append(productDetailsLink, info, itemPrice);
            itemsSection.append(itemRow);
        });


        /* ================= DELIVERY ADDRESS ================= */
        const addressSection = document.createElement("div");
        addressSection.classList.add("order-address");

        addressSection.innerHTML =
            `
    <h3>Delivery Address</h3>
      <p class="customer-name">${order.address.fullName}</p>
      <p>${order.address.phone}</p>
      <p>${order.address.addressLine}</p>
      <p>${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
    `


        /* ================= ORDER SUMMARY ================= */
        const summary = document.createElement("div");
        summary.classList.add("order-summary");

        summary.innerHTML =
            `
    <h3>Order Summary</h3>

      <div class="summary-row">
        <span>Payment Method</span>
        <span>${order.paymentMethod}</span>
      </div>

      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${order.totalAmount}</span>
      </div>

      <div class="summary-row">
        <span>Delivery</span>
        <span class="free">FREE</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>₹${order.totalAmount}</span>
      </div>
    `

        /* ================= CANCEL BUTTON ================= */
        // Only show button if order is "Pending"
        let cancelAction = document.createDocumentFragment();
        if (order.status === "Pending") {
            const btnDiv = document.createElement("div");
            btnDiv.classList.add("cancel-order-container");
            const cancelBtn = document.createElement("button");
            cancelBtn.classList.add("btn-cancel");
            cancelBtn.textContent = "Cancel Order";
            cancelBtn.onclick = () => handleCancelOrder(order._id);
            btnDiv.append(cancelBtn);
            cancelAction.append(btnDiv);
        }

        /* ================= FINAL APPEND ================= */
        container.append(
            orderHeader,
            orderTimeline,
            itemsSection,
            addressSection,
            summary,
            cancelAction
        );
    }
    catch (error) {
        showToast(error.message, "error")
    }
}


/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderOrderDetails()
    renderFooter()
});