// Catégories de dépenses
export const CATEGORIES_DEPENSES = [
  { value: 'semences', label: 'Semences' },
  { value: 'engrais', label: 'Engrais' },
  { value: 'phytosanitaires', label: 'Produits phytosanitaires' },
  { value: 'alimentation_animale', label: 'Alimentation animale' },
  { value: 'medicaments', label: 'Médicaments / Vaccins' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'carburant', label: 'Carburant' },
  { value: 'transport', label: 'Transport' },
  { value: 'main_oeuvre', label: "Main-d'œuvre" },
  { value: 'location', label: 'Location' },
  { value: 'materiel', label: 'Matériel' },
  { value: 'entretien', label: 'Entretien' },
  { value: 'energie', label: 'Énergie' },
  { value: 'autres', label: 'Autres' },
]

// Types d'activité
export const TYPES_ACTIVITE = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'elevage', label: 'Élevage' },
  { value: 'mixte', label: 'Agriculture + Élevage' },
]

// Types de cultures
export const TYPES_CULTURES = [
  'Maïs', 'Riz', 'Soja', 'Coton', 'Sorgho', 'Mil', 'Manioc',
  'Igname', 'Arachide', 'Haricot', 'Niébé', 'Tomate', 'Piment',
  'Oignon', 'Gombo', 'Chou', 'Carotte', 'Laitue', 'Concombre',
  'Pastèque', 'Ananas', 'Banane', 'Palmier à huile', 'Cacao',
  'Café', 'Teck', 'Autre',
]

// Types d'élevage
export const TYPES_ELEVAGE = [
  'Poulets de chair', 'Poules pondeuses', 'Canards', 'Pintades',
  'Dindes', 'Bovins', 'Ovins', 'Caprins', 'Porcins',
  'Lapins', 'Poissons (Aquaculture)', 'Apiculture', 'Autre',
]

// Espèces animales
export const ESPECES_ANIMALES = [
  { value: 'volaille', label: 'Volaille' },
  { value: 'bovin', label: 'Bovin' },
  { value: 'ovin', label: 'Ovin' },
  { value: 'caprin', label: 'Caprin' },
  { value: 'porcin', label: 'Porcin' },
  { value: 'lapin', label: 'Lapin' },
  { value: 'poisson', label: 'Poisson' },
  { value: 'autre', label: 'Autre' },
]

// Unités de mesure
export const UNITES = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'tonne', label: 'Tonne' },
  { value: 'sac', label: 'Sac' },
  { value: 'bassine', label: 'Bassine' },
  { value: 'panier', label: 'Panier' },
  { value: 'botte', label: 'Botte' },
  { value: 'litre', label: 'Litre' },
  { value: 'unite', label: 'Unité / Pièce' },
  { value: 'plateau', label: 'Plateau' },
  { value: 'regime', label: 'Régime' },
  { value: 'tas', label: 'Tas' },
  { value: 'autre', label: 'Autre' },
]

// Statuts
export const STATUTS_CAMPAGNE = [
  { value: 'planifiee', label: 'Planifiée', color: 'info' },
  { value: 'en_cours', label: 'En cours', color: 'warning' },
  { value: 'recolte', label: 'Récolte', color: 'primary' },
  { value: 'terminee', label: 'Terminée', color: 'success' },
  { value: 'annulee', label: 'Annulée', color: 'danger' },
]

export const STATUTS_CYCLE = [
  { value: 'preparation', label: 'Préparation', color: 'info' },
  { value: 'en_cours', label: 'En cours', color: 'warning' },
  { value: 'production', label: 'Production', color: 'primary' },
  { value: 'termine', label: 'Terminé', color: 'success' },
  { value: 'annule', label: 'Annulé', color: 'danger' },
]

// Régions du Togo (extensible)
export const REGIONS = [
  'Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes',
]

// Devise
export const DEVISE = 'FCFA'

// Types de documents
export const TYPES_DOCUMENTS = [
  { value: 'compte_exploitation', label: "Compte d'exploitation" },
  { value: 'rapport_campagne', label: 'Rapport de campagne' },
  { value: 'historique_recettes', label: 'Historique des recettes' },
  { value: 'etat_depenses', label: 'État des dépenses' },
  { value: 'synthese_exploitation', label: "Synthèse de l'exploitation" },
  { value: 'synthese_financement', label: 'Synthèse de financement' },
]

// Autorisations de partage
export const TYPES_AUTORISATIONS = [
  { value: 'profil_exploitation', label: "Profil de l'exploitation" },
  { value: 'superficie', label: 'Superficie' },
  { value: 'production', label: 'Production' },
  { value: 'depenses', label: 'Dépenses' },
  { value: 'recettes', label: 'Recettes' },
  { value: 'resultats', label: 'Résultats financiers' },
]
