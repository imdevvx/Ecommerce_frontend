import { API_BASE_URL } from "../config/config.js";
import { renderNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";
import { createProductCard } from "../components/productCard.js";

const productCardsContainer = document.querySelector("#product-cards-container");
const pageTitle = document.querySelector("#page-title");
const collectionHeroImg = document.querySelector(".collection-hero-img")
const heroHeading = document.querySelector(".hero-heading")
const heroSubTitle = document.querySelector(".hero-subtitle")

const colorFilter = document.querySelector("#color-filter");
const priceFilter = document.querySelector("#price-filter");
const clearFilters = document.querySelector(".clear-filters");

let currentPage = 1;
const limit = 4;
let isLoading = false;
let hasMore = true;

/* ===================== GET TYPE ===================== */
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

/* ===================== BUILD QUERY ===================== */
const buildQueryParams = () => {
  const params = new URLSearchParams();

  if (type === "men") {
    params.set("category", "men");
  }

  if (type === "bestseller") {
    params.set("bestseller", "true");
  }

  if (type === "new") {
    params.set("sort", "latest");
  }

  // filters
  if (colorFilter.value) {
    params.set("color", colorFilter.value);
  }

  if (priceFilter.value === "low") {
    params.set("sort", "price");
  }

  if (priceFilter.value === "high") {
    params.set("sort", "-price");
  }

  return params.toString();
};

/* ===================== TITLE ===================== */
const setPageTitle = () => {
  if (type === "men") {
    pageTitle.textContent = "Men's Collection"
    collectionHeroImg.src = "./assets/images/mensedit3.jpg"
    heroHeading.textContent = "The Men’s Edit"
    heroSubTitle.textContent = "Timeless fits and everyday essentials crafted to elevate your wardrobe without overthinking it."
  }
  else if (type === "new") {
    pageTitle.textContent = "New Arrivals"
    collectionHeroImg.src = "./assets/images/Gemini_Generated_Image_32xmdb32xmdb32xm.png"
    heroHeading.textContent = "The Just Dropped"
    heroSubTitle.textContent = "Stay ahead of the curve with our latest drops, designed for the season and beyond."
  }
  else if (type === "bestseller") {
    pageTitle.textContent = "Best Sellers"
    collectionHeroImg.src = "./assets/images/or-hakim-LSk5paRLh-Y-unsplash.jpg"
    heroHeading.textContent = "Most Coveted"
    heroSubTitle.textContent = "The most-loved silhouettes, refined over time, loved for their enduring appeal"
  }
};

/* ===================== APPLY URL ===================== */
const applyURLParamsToFilters = () => {
  const params = new URLSearchParams(window.location.search);

  const color = params.get("color");
  const sort = params.get("sort");

  if (color) colorFilter.value = color;

  if (sort === "price") priceFilter.value = "low";
  if (sort === "-price") priceFilter.value = "high";
};

/* ===================== UPDATE URL ===================== */
const updateURLFromFilters = () => {
  const params = buildQueryParams();
  window.history.replaceState({}, "", `?type=${type}&${params}`);
};

/* ===================== RESET ===================== */
const resetAndRender = () => {
  productCardsContainer.innerHTML = "";
  currentPage = 1;
  hasMore = true;
  isLoading = false;

  updateURLFromFilters();
  renderProducts();
};

/* ===================== EVENTS ===================== */
[colorFilter, priceFilter].forEach(filter => {
  filter.addEventListener("change", resetAndRender);
});

clearFilters.addEventListener("click", () => {
  colorFilter.value = "";
  priceFilter.value = "";
  resetAndRender();
});

/* ===================== FETCH ===================== */
const renderProducts = async () => {
  if (isLoading || !hasMore) return;
  isLoading = true;

  try {
    const query = buildQueryParams();

    const url = `${API_BASE_URL}/product?page=${currentPage}&limit=${limit}&${query}`;
    console.log("FETCH:", url);

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.msg || "Error");

    const products = data.products;

    if (products.length < limit) hasMore = false;

    createProductCard(products);

    currentPage++;
  } catch (error) {
    console.log(error.message);
  } finally {
    isLoading = false;
  }
};

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  setPageTitle();
  applyURLParamsToFilters();
  renderProducts();
  renderFooter();
});

/* ===================== SCROLL ===================== */
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 1500) {
    renderProducts();
  }
});