// Gestion du panier — stocké dans localStorage pour persister entre les visites.
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
  renderCart();
  renderPayPalButtons();
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

function renderCart(){
  const container = document.getElementById("cart-items");
  const cart = getCart();
  document.getElementById("cart-count").textContent = cartCount();

  if(cart.length === 0){
    container.innerHTML = `<p class="cart-empty">Votre panier est vide pour l'instant.</p>`;
  }else{
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

  document.getElementById("cart-total").textContent = cartTotal().toFixed(2) + " €";
}

function openCart(){
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}

function closeCart(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCatalog(){
  const grid = document.getElementById("catalog-grid");
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <div class="thumb"><div class="shape ${p.shape}"></div></div>
      <div class="card-body">
        <div class="card-cat">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="card-meta">
          <span class="price">${p.price.toFixed(2)} €</span>
          <span class="specs">${p.specs}</span>
        </div>
        <button class="add-btn" onclick="handleAddClick(this, '${p.id}')">Ajouter au panier</button>
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

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderCart();
  renderPayPalButtons();

  document.getElementById("cart-toggle").addEventListener("click", openCart);
  document.getElementById("close-drawer").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);
});
