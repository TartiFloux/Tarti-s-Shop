// Paiement — redirige l'acheteur vers PayPal (paypal.me) avec le montant déjà rempli,
// et vous envoie un e-mail avec le détail de la commande via EmailJS (aucun serveur requis).
//
// ⚠️ Configuration PayPal : remplacez la valeur ci-dessous par votre pseudo PayPal.me
// (créez-le sur https://www.paypal.com/paypalme/ si vous n'en avez pas encore).
const PAYPAL_ME_USERNAME = "tartifloux";

// ⚠️ Configuration e-mail (EmailJS) : voir le README, section "Recevoir un e-mail par commande".
const EMAILJS_CONFIG = {
  publicKey: "VOTRE_PUBLIC_KEY",
  serviceId: "VOTRE_SERVICE_ID",
  templateId: "VOTRE_TEMPLATE_ID"
};
const SHOP_OWNER_EMAIL = "tartifloux667@gmail.com";

let currentOrderId = null;
let orderEmailSent = false;

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

function isEmailjsConfigured(){
  return typeof emailjs !== "undefined"
    && !EMAILJS_CONFIG.publicKey.startsWith("VOTRE_")
    && !EMAILJS_CONFIG.serviceId.startsWith("VOTRE_")
    && !EMAILJS_CONFIG.templateId.startsWith("VOTRE_");
}

function sendOrderEmail(){
  if(!isEmailjsConfigured()){
    console.warn("EmailJS n'est pas configuré — voir le README pour recevoir un e-mail par commande.");
    return Promise.resolve(false);
  }

  const cart = getCart();
  const buyerEmail = (document.getElementById("buyer-email")?.value || "").trim();
  const itemsList = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    return p ? `${item.qty} × ${p.name} — ${(p.price * item.qty).toFixed(2)} €` : "";
  }).filter(Boolean).join("\n");

  const params = {
    to_email: SHOP_OWNER_EMAIL,
    order_id: currentOrderId,
    buyer_email: buyerEmail,
    items: itemsList,
    total: cartTotal().toFixed(2) + " €",
    order_date: new Date().toLocaleString("fr-FR")
  };

  return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params)
    .then(() => true)
    .catch((err) => {
      console.error("Envoi de l'e-mail de commande échoué :", err);
      return false;
    });
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

  if(!orderEmailSent){
    orderEmailSent = true;
    sendOrderEmail().then((sent) => {
      if(!sent) showToast("Pensez à coller le récapitulatif dans un e-mail — l'envoi automatique n'a pas fonctionné.");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderPaymentPanel();
  if(typeof emailjs !== "undefined" && isEmailjsConfigured()){
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }
  const payBtn = document.getElementById("pay-paypal-btn");
  if(payBtn) payBtn.addEventListener("click", goToPayPal);
  const copyBtn = document.getElementById("copy-recap-btn");
  if(copyBtn) copyBtn.addEventListener("click", copyOrderRecap);
});

