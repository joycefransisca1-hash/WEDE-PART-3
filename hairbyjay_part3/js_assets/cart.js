/* =========================================================
   cart.js
   A small shopping-cart module shared by every page.
   Uses localStorage so the cart survives a page refresh
   (it does NOT send anything anywhere — it's front-end only,
   which is normal/expected for a static student project).
   Runs on every page because the cart icon lives in the header.
   ========================================================= */

const CART_KEY = "hairbyjay_cart";

/* ---- storage helpers ---- */

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/* ---- cart operations ---- */

function addToCart(productId) {
  // PRODUCTS comes from products-data.js, which must be loaded
  // before this file on any page that calls addToCart().
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }

  saveCart(cart);
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCartDrawer();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCartDrawer();
}

function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* ---- UI: badge on the header cart icon ---- */

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

/* ---- UI: the slide-out cart drawer (markup lives in every page) ---- */

function renderCartDrawer() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!list || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">R${item.price}</p>
          <div class="qty-controls">
            <button type="button" onclick="changeQty('${item.id}', -1)" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" onclick="changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="cart-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove ${item.name}">&times;</button>
      </div>
    `).join("");
  }

  totalEl.textContent = `R${cartTotal()}`;
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  overlay.classList.add("open");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  overlay.classList.remove("open");
}

/* ---- wire up buttons that exist on every page ---- */

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();

  const cartToggle = document.getElementById("cart-toggle");
  const cartClose = document.getElementById("cart-close");
  const overlay = document.getElementById("cart-overlay");

  if (cartToggle) cartToggle.addEventListener("click", openCartDrawer);
  if (cartClose) cartClose.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);
});
