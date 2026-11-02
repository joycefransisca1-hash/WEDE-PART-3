/* =========================================================
   products.js
   Runs ONLY on products.html.
   Covers brief items:
   2.1 Interactive Elements -> lightbox gallery
   2.2 Dynamic Content      -> renders PRODUCTS into the DOM,
                                search + sort + category filter
   ========================================================= */

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `<p class="product-note">No products match your search.</p>`;
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="thumb">
        <img src="${product.image}" alt="${product.name} wig" data-lightbox="${product.image}" data-name="${product.name}">
      </div>
      <div class="info">
        <h2>${product.name}</h2>
        <p class="price">R${product.price}</p>
        <p class="product-desc">${product.description}</p>
        <button type="button" class="btn btn-add" data-id="${product.id}">Add to Cart</button>
      </div>
    </article>
  `).join("");

  // Lightbox: click a product image to see it larger
  grid.querySelectorAll("[data-lightbox]").forEach(img => {
    img.addEventListener("click", () => openLightbox(img.dataset.lightbox, img.dataset.name));
  });

  // Add to Cart buttons
  grid.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

/* ---- filter + search + sort ---- */

function applyFilters() {
  const searchTerm = document.getElementById("product-search").value.trim().toLowerCase();
  const category = document.getElementById("product-category").value;
  const sort = document.getElementById("product-sort").value;

  let results = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") results.sort((a, b) => a.name.localeCompare(b.name));

  renderProducts(results);
}

/* ---- lightbox ---- */

function openLightbox(src, name) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  if (!lb || !img) return;
  img.src = src;
  img.alt = name;
  caption.textContent = name;
  lb.classList.add("open");
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (lb) lb.classList.remove("open");
}

/* ---- init ---- */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("product-grid")) return; // not on products.html

  renderProducts(PRODUCTS);

  document.getElementById("product-search").addEventListener("input", applyFilters);
  document.getElementById("product-category").addEventListener("change", applyFilters);
  document.getElementById("product-sort").addEventListener("change", applyFilters);

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox(); // click outside image closes it
  });
});
