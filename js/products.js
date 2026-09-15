// Catalogue de Tarti's Shop.
// Pour ajouter/modifier un modèle, éditez simplement ce tableau :
// - id doit rester unique
// - price en euros (nombre, pas de symbole)
// - description : texte affiché dans la fiche détaillée ("En savoir plus")
// - images : liste de chemins vers vos photos (autant que vous voulez).
//   Déposez vos fichiers dans assets/produits/ puis listez-les ici, par ex :
//   images: ["assets/produits/fragment-12-1.jpg", "assets/produits/fragment-12-2.jpg"]
//   Si le tableau est vide, une vignette générée automatiquement est utilisée à la place.
const PRODUCTS = [
  {
    id: "fragment-12",
    name: "Fragment No. 12",
    category: "Objet — édition limitée",
    price: 34,
    specs: "86k tris · STL/OBJ",
    shape: "s1",
    description: "Une forme organique pensée comme un éclat figé : surfaces douces, arêtes franches, et un maillage nettoyé pour une impression sans supports superflus. Échelle réelle fournie, prête à redimensionner selon votre imprimante.",
    images: []
  },
  {
    id: "etagere-biseau",
    name: "Étagère Biseau",
    category: "Mobilier miniature",
    price: 19,
    specs: "42k tris · STL",
    shape: "s2",
    description: "Une étagère miniature aux angles biseautés, conçue pour les dioramas et maquettes d'architecture. Proportions vérifiées, épaisseurs calibrées pour l'impression FDM comme résine.",
    images: []
  },
  {
    id: "echo-vertical",
    name: "Écho Vertical",
    category: "Sculpture",
    price: 48,
    specs: "120k tris · OBJ/FBX",
    shape: "s3",
    description: "Une sculpture verticale à la silhouette anguleuse, pensée pour jouer avec la lumière. Topologie propre, UV dépliés, compatible avec un rendu ou une impression grand format.",
    images: []
  },
  {
    id: "lucent-vase",
    name: "Lucent Vase",
    category: "Vase & contenant",
    price: 22,
    specs: "30k tris · STL/GLTF",
    shape: "s4",
    description: "Un vase au profil rond et continu, dessiné pour une impression vase-mode (paroi unique). Base renforcée, ouverture calibrée pour accueillir un contenant en verre standard.",
    images: []
  },
  {
    id: "derive-douce",
    name: "Dérive Douce",
    category: "Objet — édition limitée",
    price: 39,
    specs: "95k tris · Blend/OBJ",
    shape: "s5",
    description: "Deux volumes qui se répondent en miroir, aux courbes adoucies. Fichier Blender source inclus pour retravailler les matériaux, en plus de l'export OBJ prêt à l'impression.",
    images: []
  },
  {
    id: "hexalithe",
    name: "Hexalithe",
    category: "Prop & décor",
    price: 27,
    specs: "58k tris · STL/FBX",
    shape: "s6",
    description: "Un monolithe hexagonal facetté, pensé comme prop de décor ou pièce d'étagère. Échelle ajustable sans perte de détail grâce à un maillage optimisé.",
    images: []
  }
];
