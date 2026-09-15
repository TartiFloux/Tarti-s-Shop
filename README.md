# Tarti's Shop

Boutique statique pour vendre des modèles 3D, avec panier, fiches produits détaillées, avis clients, FAQ et paiement PayPal. Prête à héberger sur GitHub Pages.

## Structure du projet

```
tartis-shop/
├── index.html      → boutique, tiroir panier, fiches produit, avis
├── checkout.html    → page de paiement dédiée (redirection PayPal)
├── faq.html          → questions fréquentes
├── css/
│   └── style.css
├── js/
│   ├── products.js   → le catalogue (à modifier pour vos modèles + photos)
│   ├── reviews.js      → les avis clients affichés sur la page d'accueil
│   ├── cart.js          → logique du panier (partagée entre les pages)
│   ├── product-modal.js  → fiche détaillée + défilement des photos
│   └── paiement.js        → génère le lien PayPal et le récapitulatif de commande
└── assets/
    ├── logo.svg
    ├── icon.svg
    └── produits/        → vos photos de modèles (à créer)
```

Le parcours d'achat : le client ajoute des modèles au panier depuis `index.html`, clique sur **Passer commande**, arrive sur `checkout.html` où il retrouve son panier, indique son e-mail, puis clique sur **Payer avec PayPal**. Il est alors redirigé vers une page PayPal avec **le montant déjà rempli** — il n'a plus qu'à confirmer le paiement.

## 1. Configurer PayPal

Ce système utilise **PayPal.me**, qui ne nécessite ni compte développeur ni backend : c'est un simple lien vers une page PayPal pré-remplie avec le montant.

1. Créez votre lien sur [paypal.com/paypalme](https://www.paypal.com/paypalme/) avec votre compte PayPal habituel (celui qui recevra les paiements).
2. Notez le pseudo choisi (ex. `paypal.me/monpseudo` → le pseudo est `monpseudo`).
3. Ouvrez `js/paiement.js` et remplacez la valeur suivante :

```js
const PAYPAL_ME_USERNAME = "VotrePseudoPayPal";
```

4. C'est tout : le bouton **Payer avec PayPal** de `checkout.html` construira automatiquement un lien du type `paypal.me/monpseudo/34.00EUR` avec le total exact du panier.

### Important à savoir

Ce site est hébergé sur GitHub Pages, qui ne fait que servir des fichiers statiques (pas de serveur). Le paiement est donc une **redirection vers PayPal**, pas une intégration en popup : l'acheteur quitte temporairement votre site, paie sur PayPal, puis peut revenir. PayPal.me ne transmet pas automatiquement le détail du panier — c'est pourquoi la page de paiement affiche un **récapitulatif à copier** (référence de commande + articles + total) que l'acheteur colle dans le champ note de PayPal, ou vous transmet par e-mail.

Comme rien ne confirme automatiquement le paiement côté site, la livraison des fichiers reste **manuelle** (voir section suivante) : vous vérifiez la réception du virement sur votre compte PayPal, puis envoyez les fichiers à l'adresse e-mail indiquée par l'acheteur.

## 2. Livrer les fichiers après achat

PayPal vous notifie de la réception du virement (e-mail + votre tableau de bord PayPal), mais n'envoie pas vos fichiers 3D automatiquement — la livraison est **manuelle** avec ce système :

1. Vous recevez le paiement sur PayPal, avec la référence de commande dans la note (si l'acheteur l'a bien collée) ou par e-mail séparé.
2. Vous répondez à l'adresse e-mail indiquée par l'acheteur sur la page de paiement, en joignant les fichiers correspondant à sa commande.

Si votre volume de ventes augmente, vous pourrez plus tard automatiser cette étape avec un service tiers (formulaire + envoi automatique, ou un vrai backend de paiement), mais ce n'est pas nécessaire pour démarrer.

## 3. Modifier le catalogue

Éditez `js/products.js`. Chaque produit :

```js
{
  id: "identifiant-unique",
  name: "Nom du modèle",
  category: "Catégorie affichée",
  price: 29,                // en euros, sans symbole
  specs: "50k tris · STL",
  shape: "s1",               // s1 à s6, utilisé tant qu'aucune photo n'est ajoutée
  description: "Un texte plus détaillé, affiché dans la fiche « En savoir plus ».",
  images: []                  // vos photos, voir ci-dessous
}
```

### Ajouter des photos à un modèle

1. Créez un dossier `assets/produits/` s'il n'existe pas déjà.
2. Déposez-y vos photos, par exemple `fragment-12-1.jpg`, `fragment-12-2.jpg`, etc.
3. Listez-les dans le produit correspondant, dans l'ordre d'affichage souhaité :

```js
images: [
  "assets/produits/fragment-12-1.jpg",
  "assets/produits/fragment-12-2.jpg",
  "assets/produits/fragment-12-3.jpg"
]
```

La première photo devient la vignette du catalogue. S'il y a plusieurs photos, la fiche détaillée ("En savoir plus") affiche des flèches et des points pour les faire défiler. Si `images` reste vide (`[]`), la forme générée en CSS est utilisée à la place — vous pouvez donc ajouter les photos plus tard, modèle par modèle.

## 4. Modifier les avis clients

Éditez `js/reviews.js`. Chaque avis :

```js
{
  name: "Prénom N.",
  note: 5,                    // de 1 à 5
  productId: "fragment-12",   // facultatif, doit correspondre à un id de products.js
  text: "Le texte de l'avis."
}
```

## 5. Modifier la FAQ

Éditez directement `faq.html` : chaque question est un bloc

```html
<details class="faq-item">
  <summary>Votre question ?</summary>
  <div class="faq-answer"><p>Votre réponse.</p></div>
</details>
```

Copiez-collez ce bloc pour ajouter une question, ou modifiez le texte d'un bloc existant.

## 6. Déployer sur GitHub Pages

1. Créez un dépôt GitHub et déposez tout le contenu de ce dossier à la racine.
2. Dans le dépôt : **Settings → Pages**.
3. Sous **Source**, choisissez la branche `main` et le dossier `/ (root)`.
4. Enregistrez — votre boutique sera disponible sous `https://votre-nom-utilisateur.github.io/nom-du-depot/` après une à deux minutes.

GitHub Pages sert le site en HTTPS par défaut, ce qui est requis par PayPal.

## 7. Personnaliser le logo

`assets/logo.svg` et `assets/icon.svg` sont des SVG modifiables dans n'importe quel éditeur (Figma, Illustrator, ou directement dans un éditeur de texte — ce sont des balises `<polygon>` et `<text>`). Les couleurs sont pilotées par les dégradés définis en haut de chaque fichier.
