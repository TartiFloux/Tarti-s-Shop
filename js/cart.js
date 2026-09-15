// Gestion du panier — stocké dans localStorage pour persister entre les pages et les visites.
const CART_KEY = "tartis-shop-cart";

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartUI();
  if(typeof renderPaymentPanel === "function") renderPaymentPanel();
}

function addToCart(productId){
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if(existing){
    existing.qty += 1;
  }else{
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showToast("Ajouté au panier");
}

function updateQty(productId, delta){
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart(cart);
}

function removeFromCart(productId){
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function cartTotal(){
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function cartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Rendu commun : compteur du panier (présent sur toutes les pages) ---------- */
function renderCartUI(){
  const countEl = document.getElementById("cart-count");
  if(countEl) countEl.textContent = cartCount();

  // Tiroir panier (index.html)
  const drawerItems = document.getElementById("cart-items");
  if(drawerItems) renderItemsInto(drawerItems);

  const drawerTotal = document.getElementById("cart-total");
  if(drawerTotal) drawerTotal.textContent = cartTotal().toFixed(2) + " €";

  // Page paiement (checkout.html)
  const checkoutItems = document.getElementById("checkout-items");
  if(checkoutItems) renderItemsInto(checkoutItems);

  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  if(checkoutSubtotal) checkoutSubtotal.textContent = cartTotal().toFixed(2) + " €";
  const checkoutTotal = document.getElementById("checkout-total");
  if(checkoutTotal) checkoutTotal.textContent = cartTotal().toFixed(2) + " €";

  const emptyState = document.getElementById("empty-checkout");
  const payPanel = document.getElementById("payment-panel");
  if(emptyState && payPanel){
    const empty = getCart().length === 0;
    emptyState.style.display = empty ? "block" : "none";
    payPanel.style.display = empty ? "none" : "block";
  }

  const goToCheckoutBtn = document.getElementById("go-to-checkout");
  if(goToCheckoutBtn){
    const empty = getCart().length === 0;
    goToCheckoutBtn.classList.toggle("is-disabled", empty);
    goToCheckoutBtn.setAttribute("aria-disabled", empty ? "true" : "false");
  }
}

function renderItemsInto(container){
  const cart = getCart();
  if(cart.length === 0){
    container.innerHTML = `<p class="cart-empty">Votre panier est vide pour l'instant.</p>`;
    return;
  }
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if(!p) return "";
    return `
      <div class="cart-item">
        <div class="mini-shape shape ${p.shape}"></div>
        <div class="ci-info">
          <div class="name">${p.name}</div>
          <div class="price">${p.price.toFixed(2)} € × ${item.qty}</div>
        </div>
        <div class="qty-controls">
          <button aria-label="Diminuer la quantité" onclick="updateQty('${p.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button aria-label="Augmenter la quantité" onclick="updateQty('${p.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${p.id}')">Retirer</button>
      </div>`;
  }).join("");
}

/* ---------- Catalogue (index.html uniquement) ---------- */
function renderCatalog(){
  const grid = document.getElementById("catalog-grid");
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <div class="thumb" onclick="openProductModal('${p.id}')">${p.images.length ? `<img src="${p.images[0]}" alt="${p.name}">` : `<div class="shape ${p.shape}"></div>`}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="pill-row">
          <span class="pill pill-accent">${p.category}</span>
          <span class="pill">${p.specs}</span>
        </div>
        <div class="card-meta">
          <span class="price">${p.price.toFixed(2)} €</span>
        </div>
        <div class="card-actions">
          <button class="add-btn" onclick="handleAddClick(this, '${p.id}')">Ajouter au panier</button>
          <button class="more-btn" onclick="openProductModal('${p.id}')">En savoir plus</button>
        </div>
      </div>
    </div>
  `).join("");
}

function handleAddClick(btn, productId){
  addToCart(productId);
  btn.textContent = "Ajouté ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Ajouter au panier";
    btn.classList.remove("added");
  }, 1200);
}

/* ---------- Tiroir panier (index.html uniquement) ---------- */
function openCart(){
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function closeCart(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderCartUI();
  if(typeof renderPaymentPanel === "function") renderPaymentPanel();

  const cartToggle = document.getElementById("cart-toggle");
  const closeDrawer = document.getElementById("close-drawer");
  const overlay = document.getElementById("overlay");
  if(cartToggle) cartToggle.addEventListener("click", openCart);
  if(closeDrawer) closeDrawer.addEventListener("click", closeCart);
  if(overlay) overlay.addEventListener("click", closeCart);
});
