// Intégration PayPal — encaisse directement sur le compte PayPal renseigné
// dans index.html via le paramètre "client-id" du SDK.
//
// ⚠️ Lisez le README avant mise en ligne : ce site étant hébergé sur
// GitHub Pages (statique, pas de serveur), la capture de la commande se
// fait côté client via le SDK PayPal. C'est suffisant pour une petite
// boutique, mais pour une activité plus importante, envisagez de
// capturer la commande côté serveur (ex: une fonction serverless)
// pour éviter qu'un client ne manipule le montant envoyé.

let paypalButtonsInstance = null;

function renderPayPalButtons(){
  const container = document.getElementById("paypal-button-container");
  if(!container || typeof paypal === "undefined") return;

  container.innerHTML = "";

  const total = cartTotal();
  if(total <= 0){
    container.innerHTML = `<p class="checkout-note">Ajoutez un modèle au panier pour payer.</p>`;
    return;
  }

  paypalButtonsInstance = paypal.Buttons({
    style: {
      layout: "vertical",
      color: "black",
      shape: "pill",
      label: "paypal"
    },

    createOrder: function(data, actions){
      const cart = getCart();
      const items = cart.map(item => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        return {
          name: p.name,
          unit_amount: { currency_code: "EUR", value: p.price.toFixed(2) },
          quantity: String(item.qty)
        };
      });

      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "EUR", value: total.toFixed(2) }
            }
          },
          items: items
        }]
      });
    },

    onApprove: function(data, actions){
      return actions.order.capture().then(function(details){
        localStorage.removeItem(CART_KEY);
        renderCart();
        showConfirmation(details);
      });
    },

    onError: function(err){
      console.error("Erreur PayPal :", err);
      showToast("Le paiement a échoué, réessayez.");
    },

    onCancel: function(){
      showToast("Paiement annulé.");
    }

  });

  paypalButtonsInstance.render("#paypal-button-container");
}

function showConfirmation(details){
  const name = details.payer && details.payer.name ? details.payer.name.given_name : "";
  const container = document.getElementById("cart-items");
  container.innerHTML = `
    <div class="cart-empty">
      <p style="color:#241F2E; font-weight:500; margin-bottom:6px;">Merci ${name} !</p>
      <p>Votre commande est confirmée. Un e-mail de PayPal contenant le reçu vous a été envoyé — répondez-y pour recevoir vos fichiers, ou automatisez l'envoi via l'IPN/webhook PayPal (voir README).</p>
    </div>`;
  document.getElementById("paypal-button-container").innerHTML = "";
  document.getElementById("cart-total").textContent = "0.00 €";
}
