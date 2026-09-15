# Tarti's Shop

Boutique statique pour vendre des modèles 3D, avec panier et paiement PayPal. Prête à héberger sur GitHub Pages.

## Structure du projet

```
tartis-shop/
├── index.html      → boutique + tiroir panier
├── checkout.html    → page de paiement dédiée (bouton PayPal)
├── css/
│   └── style.css
├── js/
│   ├── products.js   → le catalogue (à modifier pour vos modèles)
│   ├── cart.js        → logique du panier (partagée entre les deux pages)
│   └── paypal.js       → intégration des paiements (rendu sur checkout.html)
└── assets/
    ├── logo.svg
    └── icon.svg
```

Le parcours d'achat : le client ajoute des modèles au panier depuis `index.html`, clique sur **Passer commande**, arrive sur `checkout.html` où il retrouve son panier et paie directement sur le site via le bouton PayPal (pas de redirection vers paypal.com, le paiement se fait en popup/inline tout en restant sur votre domaine).

## 1. Configurer PayPal

1. Créez un compte développeur sur [developer.paypal.com](https://developer.paypal.com) (utilisez votre compte PayPal habituel, celui qui recevra les paiements).
2. Dans **My Apps & Credentials**, créez une application (mode **Sandbox** pour tester, **Live** pour encaisser réellement).
3. Copiez le **Client ID** généré.
4. Dans `index.html`, remplacez `YOUR_PAYPAL_CLIENT_ID` par ce Client ID :

```html
<script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID&currency=EUR"></script>
```

Le SDK n'est chargé que dans `checkout.html` (c'est la seule page où le bouton de paiement apparaît).

5. Testez d'abord en Sandbox avec un compte acheteur de test (fourni dans votre tableau de bord développeur), avant de repasser en Client ID **Live**.

### Important à savoir

Ce site est hébergé sur GitHub Pages, qui ne fait que servir des fichiers statiques (pas de serveur). Le paiement fonctionne donc entièrement **côté client** via le SDK JavaScript de PayPal : la commande est créée puis capturée directement dans le navigateur de l'acheteur, et l'argent arrive sur votre compte PayPal.

C'est un fonctionnement tout à fait valable pour une petite boutique. Sa seule limite : rien ne vérifie côté serveur que le montant envoyé à PayPal correspond exactement au panier (un utilisateur très motivé pourrait bricoler le montant via la console de son navigateur). Pour une boutique avec un volume de ventes plus important, l'étape suivante serait de déplacer `createOrder` et la capture vers une fonction serverless (Cloudflare Workers, Vercel, Netlify Functions...) qui recalcule le total à partir des `id` produits plutôt que de faire confiance au total envoyé par le navigateur.

## 2. Livrer les fichiers après achat

PayPal envoie un e-mail de reçu à l'acheteur, mais n'envoie pas vos fichiers 3D automatiquement. Deux options simples :

- **Manuel** : vous recevez une notification de vente, vous répondez à l'acheteur par e-mail avec les fichiers.
- **Automatique** : utilisez les [webhooks PayPal](https://developer.paypal.com/api/rest/webhooks/) pour déclencher l'envoi automatique (nécessite un petit service côté serveur, par exemple une fonction serverless qui reçoit l'événement `CHECKOUT.ORDER.APPROVED` et envoie l'e-mail avec un lien de téléchargement).

## 3. Modifier le catalogue

Éditez `js/products.js`. Chaque produit :

```js
{
  id: "identifiant-unique",
  name: "Nom du modèle",
  category: "Catégorie affichée",
  price: 29,              // en euros, sans symbole
  specs: "50k tris · STL",
  shape: "s1"              // s1 à s6, ou dupliquez une classe .shape dans style.css pour une nouvelle forme
}
```

Les vignettes sont actuellement des formes générées en CSS (pas de vraies images). Pour utiliser vos propres rendus/photos, remplacez dans `js/cart.js` la ligne :

```js
<div class="thumb"><div class="shape ${p.shape}"></div></div>
```

par :

```js
<div class="thumb"><img src="assets/produits/${p.id}.jpg" alt="${p.name}"></div>
```

et ajoutez vos images dans `assets/produits/`.

## 4. Déployer sur GitHub Pages

1. Créez un dépôt GitHub et déposez tout le contenu de ce dossier à la racine.
2. Dans le dépôt : **Settings → Pages**.
3. Sous **Source**, choisissez la branche `main` et le dossier `/ (root)`.
4. Enregistrez — votre boutique sera disponible sous `https://votre-nom-utilisateur.github.io/nom-du-depot/` après une à deux minutes.

GitHub Pages sert le site en HTTPS par défaut, ce qui est requis par PayPal.

## 5. Personnaliser le logo

`assets/logo.svg` et `assets/icon.svg` sont des SVG modifiables dans n'importe quel éditeur (Figma, Illustrator, ou directement dans un éditeur de texte — ce sont des balises `<polygon>` et `<text>`). Les couleurs sont pilotées par les dégradés définis en haut de chaque fichier.
