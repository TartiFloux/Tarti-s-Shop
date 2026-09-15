// Fiche détaillée d'un modèle ("En savoir plus") + défilement des photos.
let currentModalProduct = null;
let currentImageIndex = 0;

function openProductModal(productId){
  const product = PRODUCTS.find(p => p.id === productId);
  if(!product) return;
  currentModalProduct = product;
  currentImageIndex = 0;
  renderProductModal();
  document.getElementById("product-modal").classList.add("open");
  document.getElementById("product-overlay").classList.add("open");
}

function closeProductModal(){
  document.getElementById("product-modal").classList.remove("open");
  document.getElementById("product-overlay").classList.remove("open");
  currentModalProduct = null;
}

function shiftModalImage(delta){
  if(!currentModalProduct || currentModalProduct.images.length === 0) return;
  const total = currentModalProduct.images.length;
  currentImageIndex = (currentImageIndex + delta + total) % total;
  renderModalVisual();
  renderModalDots();
}

function goToModalImage(index){
  currentImageIndex = index;
  renderModalVisual();
  renderModalDots();
}

function renderModalVisual(){
  const visual = document.getElementById("modal-visual");
  if(!visual || !currentModalProduct) return;
  const hasImages = currentModalProduct.images.length > 0;

  if(hasImages){
    visual.innerHTML = `<img src="${currentModalProduct.images[currentImageIndex]}" alt="${currentModalProduct.name}">`;
  }else{
    visual.innerHTML = `<div class="thumb modal-thumb"><div class="shape ${currentModalProduct.shape}"></div></div>`;
  }

  const nav = document.getElementById("modal-nav");
  if(nav) nav.style.display = currentModalProduct.images.length > 1 ? "flex" : "none";
}

function renderModalDots(){
  const dots = document.getElementById("modal-dots");
  if(!dots || !currentModalProduct) return;
  if(currentModalProduct.images.length <= 1){
    dots.innerHTML = "";
    return;
  }
  dots.innerHTML = currentModalProduct.images.map((_, i) =>
    `<button class="modal-dot ${i === currentImageIndex ? "active" : ""}" aria-label="Photo ${i + 1}" onclick="goToModalImage(${i})"></button>`
  ).join("");
}

function renderProductModal(){
  const p = currentModalProduct;
  if(!p) return;

  renderModalVisual();
  renderModalDots();

  document.getElementById("modal-category").textContent = p.category;
  document.getElementById("modal-name").textContent = p.name;
  document.getElementById("modal-specs").textContent = p.specs;
  document.getElementById("modal-description").textContent = p.description || "";
  document.getElementById("modal-price").textContent = p.price.toFixed(2) + " €";
  const addBtn = document.getElementById("modal-add-btn");
  if(addBtn) addBtn.setAttribute("onclick", `handleAddClick(this, '${p.id}')`);
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("product-overlay");
  if(overlay) overlay.addEventListener("click", closeProductModal);

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeProductModal();
    if(e.key === "ArrowRight" && document.getElementById("product-modal").classList.contains("open")) shiftModalImage(1);
    if(e.key === "ArrowLeft" && document.getElementById("product-modal").classList.contains("open")) shiftModalImage(-1);
  });
});
