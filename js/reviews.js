// Avis clients — pour en ajouter un, complétez ce tableau.
// note : de 1 à 5. productId (facultatif) : lie l'avis à un modèle du catalogue.
const REVIEWS = [
  {
    name: "Camille R.",
    note: 5,
    productId: "fragment-12",
    text: "Maillage impeccable, aucune retouche nécessaire avant impression. Le rendu final est encore plus fin que sur les photos."
  },
  {
    name: "Yanis B.",
    note: 5,
    productId: "echo-vertical",
    text: "Fichier livré rapidement après le paiement, échelle réelle respectée au millimètre. Exactement ce qu'il me fallait pour ma vitrine."
  },
  {
    name: "Sofia M.",
    note: 4,
    productId: "lucent-vase",
    text: "Très belle pièce, impression en mode vase parfaite du premier coup. Petit bémol sur le délai de livraison des fichiers, sinon rien à dire."
  },
  {
    name: "Hugo T.",
    note: 5,
    productId: "hexalithe",
    text: "Déjà ma troisième commande sur la boutique. Toujours le même soin apporté aux fichiers, et le vendeur répond vite si besoin."
  }
];

function renderReviews(){
  const grid = document.getElementById("reviews-grid");
  if(!grid) return;
  grid.innerHTML = REVIEWS.map(r => {
    const product = typeof PRODUCTS !== "undefined" ? PRODUCTS.find(p => p.id === r.productId) : null;
    const stars = "★".repeat(r.note) + "☆".repeat(5 - r.note);
    return `
      <div class="review-card">
        <div class="review-stars" aria-label="${r.note} sur 5">${stars}</div>
        <p class="review-text">${r.text}</p>
        <div class="review-foot">
          <span class="review-name">${r.name}</span>
          ${product ? `<span class="review-product">${product.name}</span>` : ""}
        </div>
      </div>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", renderReviews);
