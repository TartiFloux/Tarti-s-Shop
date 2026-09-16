// Paiement — redirige l'acheteur vers PayPal (paypal.me) avec le montant déjà rempli.
// ⚠️ Configuration : remplacez la valeur ci-dessous par votre pseudo PayPal.me
// (créez-le sur https://www.paypal.com/paypalme/ si vous n'en avez pas encore).
const PAYPAL_ME_USERNAME = "paypal.me/tartifloux";

let currentOrderId = null;

function generateOrderId(){
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return "TS-" + stamp;
}

function buildPayPalMeLink(amount){
  const value = amount.toFixed(2);
  return `https://paypal.me/${PAYPAL_ME_USERNAME}/${value}EUR`;
}

function buildOrderRecap(){
  const cart = getCart();
  const email = (document.getElementById("buyer-email")?.value || "").trim();
  const lines = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return p ? `${item.qty} × ${p.name} — ${(p.price * item.qty).toFixed(2)} €` : "";
  }).filter(Boolean);

  return [
    `Commande ${currentOrderId} — Tarti's Shop`,
    ...lines,
    `Total : ${cartTotal().toFixed(2)} €`,
    email ? `Fichiers à envoyer à : ${email}` : null
  ].filter(Boolean).join("\n");
}

function renderPaymentPanel(){
  const panel = document.getElementById("payment-panel");
  if(!panel) return;

  if(!currentOrderId) currentOrderId = generateOrderId();

  const orderIdEl = document.getElementById("order-id");
  if(orderIdEl) orderIdEl.textContent = currentOrderId;
}

function copyOrderRecap(){
  const recap = buildOrderRecap();
  const button = document.getElementById("copy-recap-btn");

  navigator.clipboard.writeText(recap).then(() => {
    if(button){
      const original = button.textContent;
      button.textContent = "Copié ✓";
      setTimeout(() => { button.textContent = original; }, 1600);
    }
  }).catch(() => {
    showToast("Impossible de copier — sélectionnez le texte manuellement.");
  });
}

function goToPayPal(){
  const total = cartTotal();
  if(total <= 0) return;

  const email = (document.getElementById("buyer-email")?.value || "").trim();
  if(!email){
    showToast("Indiquez votre e-mail pour recevoir vos fichiers.");
    document.getElementById("buyer-email")?.focus();
    return;
  }

  if(!currentOrderId) currentOrderId = generateOrderId();
  const link = buildPayPalMeLink(total);
  window.open(link, "_blank", "noopener");

  const confirmEl = document.getElementById("payment-confirm-note");
  if(confirmEl) confirmEl.classList.add("show");
  const echoEl = document.getElementById("order-id-echo");
  if(echoEl) echoEl.textContent = currentOrderId;
}

document.addEventListener("DOMContentLoaded", () => {
  renderPaymentPanel();
  const payBtn = document.getElementById("pay-paypal-btn");
  if(payBtn) payBtn.addEventListener("click", goToPayPal);
  const copyBtn = document.getElementById("copy-recap-btn");
  if(copyBtn) copyBtn.addEventListener("click", copyOrderRecap);
});
