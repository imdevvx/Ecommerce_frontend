const footer = document.querySelector("#footer")
export const renderFooter = () => {
    footer.innerHTML =
        `
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-col brand-col">
          <h2 class="footer-logo">DVL</h2>
          <p>Premium denim and contemporary fashion essentials designed for the modern wardrobe.</p>
        </div>

        <div class="footer-col shop-col">
          <h3>Shop</h3>
          <ul>
            <li><a href="#exp_collection">All Collections</a></li>
            <li><a href="./collection.html?type=men">Men's Jeans</a></li>
            <li><a href="./collection.html?type=new">New Arrivals</a></li>
          </ul>
        </div>

        <div class="footer-col support-col">
          <h3>Support</h3>
          <ul>
            <li><a href="contact-us.html">Contact Us</a></li>
            <li><a href="shipping-returns.html">Shipping & Returns</a></li>
            <li><a href="order.html">Track Order</a></li>
          </ul>
        </div>

        <div class="footer-col social-col">
          <div class="footer-social-links">
            <a href="https://instagram.com/imdevx" target="_blank" class="social-item">
              Instagram
            </a>
            <a href="https://wa.me/8588949227" target="_blank" class="social-item">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="bottom-container">
          <p>&copy; 2026 DVL. All rights reserved.</p>
          <div class="legal-links">
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms.html">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
    `
}