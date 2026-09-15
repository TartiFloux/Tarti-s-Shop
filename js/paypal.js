// Intégration PayPal — encaisse directement sur le compte PayPal renseigné
// dans checkout.html via le paramètre "client-id" du SDK.
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
  if(total <= 0) return;

  paypalButtonsInstance = paypal.Buttons({
    style: {
      layout: "vertical",
      color: "gold",
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
  const checkoutPage = document.querySelector(".checkout-page");
  if(!checkoutPage) return;

  checkoutPage.innerHTML = `
    <div class="panel" style="grid-column: 1 / -1; text-align:center; padding:60px 40px;">
      <h2 style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:1.8rem; margin-bottom:14px;">Merci ${name} ✦ votre commande est confirmée</h2>
      <p style="color:var(--ink-dim); max-width:46ch; margin:0 auto 28px; line-height:1.6;">
        Un e-mail de confirmation vous a été envoyé par PayPal. Vos fichiers 3D vous seront transmis
        très prochainement — répondez à cet e-mail si vous avez la moindre question.
      </p>
      <a href="index.html" class="btn-primary">Retour à la boutique</a>
    </div>`;
}
