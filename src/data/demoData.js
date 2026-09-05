/**
 * Données de démonstration — clairement identifiées comme [DEMO]
 * Ces données servent uniquement à illustrer l'interface
 */

import DataService from '../services/DataService'

export function loadDemoData(force = false) {
  const existingDemoUser = DataService.read('users', 'demo_user_001')
  if (!force && localStorage.getItem('agrifin_demo_loaded') && existingDemoUser) return

  const userId = 'demo_user_001'
  const exploitationId = 'demo_exploit_001'

  // Utilisateur démo
  DataService.create('users', {
    id: userId,
    nom: 'KOUDJO',
    prenom: 'Kofi',
    email: 'demo@agrifin.tg',
    password: 'demo1234',
    telephone: '+228 90 12 34 56',
    localisation: 'Région Maritime',
    commune: 'Tsévié',
    village: 'Aképé',
    role: 'exploitant',
    statut: 'Exploitant individuel',
  })

  // Exploitation
  DataService.create('exploitations', {
    id: exploitationId,
    userId,
    nom: 'Ferme Espoir [DEMO]',
    typeActivite: 'mixte',
    localisation: 'Tsévié, Maritime',
    superficie: 8.5,
    nombreParcelles: 3,
    cultures: 'Maïs, Soja, Tomate',
    elevage: 'Poulets de chair',
    infrastructures: 'Poulailler, Magasin de stockage',
    equipements: 'Motoculteur, Pulvérisateur',
    cooperative: 'Coopérative Espoir Vert',
  })

  // Parcelles
  const parcelle1Id = 'demo_parcelle_001'
  const parcelle2Id = 'demo_parcelle_002'
  const parcelle3Id = 'demo_parcelle_003'

  DataService.create('parcelles', {
    id: parcelle1Id, userId, exploitationId,
    nom: 'Parcelle Nord', superficie: 4, localisation: 'Route de Tabligbo',
    cultureActuelle: 'Maïs',
  })
  DataService.create('parcelles', {
    id: parcelle2Id, userId, exploitationId,
    nom: 'Parcelle Sud', superficie: 3, localisation: 'Quartier Agbélouvé',
    cultureActuelle: 'Soja',
  })
  DataService.create('parcelles', {
    id: parcelle3Id, userId, exploitationId,
    nom: 'Jardin maraîcher', superficie: 1.5, localisation: 'Derrière la maison',
    cultureActuelle: 'Tomate',
  })

  // Campagnes
  const campagne1Id = 'demo_campagne_001'
  const campagne2Id = 'demo_campagne_002'
  const campagne3Id = 'demo_campagne_003'

  DataService.create('campagnes', {
    id: campagne1Id, userId, exploitationId,
    nom: 'Campagne Maïs 2025',
    parcelleId: parcelle1Id, parcelleName: 'Parcelle Nord',
    superficie: 4, culture: 'Maïs',
    dateDebut: '2025-04-01', dateFinPrevue: '2025-08-15',
    objectifProduction: 6000, statut: 'terminee',
  })
  DataService.create('campagnes', {
    id: campagne2Id, userId, exploitationId,
    nom: 'Campagne Soja 2025',
    parcelleId: parcelle2Id, parcelleName: 'Parcelle Sud',
    superficie: 3, culture: 'Soja',
    dateDebut: '2025-05-15', dateFinPrevue: '2025-09-30',
    objectifProduction: 3000, statut: 'terminee',
  })
  DataService.create('campagnes', {
    id: campagne3Id, userId, exploitationId,
    nom: 'Campagne Maïs 2026',
    parcelleId: parcelle1Id, parcelleName: 'Parcelle Nord',
    superficie: 4, culture: 'Maïs',
    dateDebut: '2026-04-01', dateFinPrevue: '2026-08-30',
    objectifProduction: 7000, statut: 'en_cours',
  })

  // Cycle d'élevage
  const cycle1Id = 'demo_cycle_001'
  DataService.create('cycles_elevage', {
    id: cycle1Id, userId, exploitationId,
    nom: 'Poulets de chair — Lot 3',
    espece: 'volaille', typeElevage: 'Poulets de chair',
    nombreInitial: 500, dateDebut: '2026-06-01',
    dateFinPrevue: '2026-08-15',
    mortalite: 12, statut: 'en_cours',
  })

  // Dépenses — Campagne Maïs 2025
  const depenses2025 = [
    { date: '2025-04-02', montant: 75000, categorie: 'main_oeuvre', description: 'Labour mécanique (4 ha)', campagneId: campagne1Id },
    { date: '2025-04-05', montant: 48000, categorie: 'semences', description: 'Semences maïs améliorées (40 kg)', campagneId: campagne1Id },
    { date: '2025-04-06', montant: 15000, categorie: 'main_oeuvre', description: 'Semis (4 jours × 2 personnes)', campagneId: campagne1Id },
    { date: '2025-05-01', montant: 96000, categorie: 'engrais', description: 'NPK 15-15-15 (4 sacs)', campagneId: campagne1Id },
    { date: '2025-05-20', montant: 72000, categorie: 'engrais', description: 'Urée (3 sacs)', campagneId: campagne1Id },
    { date: '2025-05-25', montant: 18000, categorie: 'phytosanitaires', description: 'Herbicide post-levée', campagneId: campagne1Id },
    { date: '2025-06-10', montant: 30000, categorie: 'main_oeuvre', description: 'Sarclage', campagneId: campagne1Id },
    { date: '2025-08-01', montant: 45000, categorie: 'main_oeuvre', description: 'Récolte (5 jours)', campagneId: campagne1Id },
    { date: '2025-08-05', montant: 20000, categorie: 'transport', description: 'Transport récolte vers magasin', campagneId: campagne1Id },
  ]

  // Dépenses — Campagne Soja 2025
  const depensesSoja = [
    { date: '2025-05-16', montant: 56000, categorie: 'main_oeuvre', description: 'Labour et planage (3 ha)', campagneId: campagne2Id },
    { date: '2025-05-18', montant: 54000, categorie: 'semences', description: 'Semences soja (30 kg)', campagneId: campagne2Id },
    { date: '2025-06-15', montant: 45000, categorie: 'engrais', description: 'Engrais organique', campagneId: campagne2Id },
    { date: '2025-07-10', montant: 25000, categorie: 'main_oeuvre', description: 'Désherbage', campagneId: campagne2Id },
    { date: '2025-09-15', montant: 35000, categorie: 'main_oeuvre', description: 'Récolte soja', campagneId: campagne2Id },
  ]

  // Dépenses — Campagne Maïs 2026 (en cours)
  const depenses2026 = [
    { date: '2026-04-03', montant: 80000, categorie: 'main_oeuvre', description: 'Labour mécanique', campagneId: campagne3Id },
    { date: '2026-04-07', montant: 52000, categorie: 'semences', description: 'Semences maïs (45 kg)', campagneId: campagne3Id },
    { date: '2026-05-05', montant: 105000, categorie: 'engrais', description: 'NPK + Urée', campagneId: campagne3Id },
    { date: '2026-06-01', montant: 22000, categorie: 'phytosanitaires', description: 'Traitement phyto', campagneId: campagne3Id },
  ]

  // Dépenses élevage
  const depensesElevage = [
    { date: '2026-06-01', montant: 375000, categorie: 'alimentation_animale', description: 'Poussins (500 unités)', cycleId: cycle1Id },
    { date: '2026-06-01', montant: 45000, categorie: 'medicaments', description: 'Vaccins et vitamines', cycleId: cycle1Id },
    { date: '2026-06-15', montant: 180000, categorie: 'alimentation_animale', description: 'Provende démarrage (20 sacs)', cycleId: cycle1Id },
    { date: '2026-07-01', montant: 240000, categorie: 'alimentation_animale', description: 'Provende croissance (25 sacs)', cycleId: cycle1Id },
    { date: '2026-07-15', montant: 30000, categorie: 'medicaments', description: 'Traitement coccidiose', cycleId: cycle1Id },
    { date: '2026-08-01', montant: 120000, categorie: 'alimentation_animale', description: 'Provende finition (12 sacs)', cycleId: cycle1Id },
  ]

  const allDepenses = [...depenses2025, ...depensesSoja, ...depenses2026, ...depensesElevage]
  allDepenses.forEach(d => DataService.create('depenses', { ...d, userId }))

  // Recettes — Campagne Maïs 2025
  const recettesMais2025 = [
    { date: '2025-08-20', produit: 'Maïs grain', quantite: 3500, unite: 'kg', prixUnitaire: 180, montantTotal: 630000, acheteur: 'Commerçant Lomé', campagneId: campagne1Id },
    { date: '2025-09-10', produit: 'Maïs grain', quantite: 2000, unite: 'kg', prixUnitaire: 200, montantTotal: 400000, acheteur: 'Coopérative locale', campagneId: campagne1Id },
  ]

  // Recettes Soja 2025
  const recettesSoja = [
    { date: '2025-10-01', produit: 'Soja', quantite: 2200, unite: 'kg', prixUnitaire: 350, montantTotal: 770000, acheteur: 'SOJA PLUS SARL', campagneId: campagne2Id },
  ]

  const allRecettes = [...recettesMais2025, ...recettesSoja]
  allRecettes.forEach(r => DataService.create('recettes', { ...r, userId }))

  // Productions
  DataService.create('productions', {
    userId, produit: 'Maïs grain', quantite: 5500, unite: 'kg',
    date: '2025-08-10', campagneId: campagne1Id, parcelleId: parcelle1Id,
    destination: 'Vente', quantiteVendue: 5500, quantiteRestante: 0,
  })
  DataService.create('productions', {
    userId, produit: 'Soja', quantite: 2200, unite: 'kg',
    date: '2025-09-20', campagneId: campagne2Id, parcelleId: parcelle2Id,
    destination: 'Vente', quantiteVendue: 2200, quantiteRestante: 0,
  })

  // Coopérative démo
  DataService.create('cooperatives', {
    id: 'demo_coop_001',
    nom: 'Coopérative Espoir Vert [DEMO]',
    localisation: 'Tsévié, Maritime',
    telephone: '+228 91 00 00 00',
    email: 'coop@espoir-vert.tg',
    nombreMembres: 45,
    superficieTotale: 180,
    activites: 'Maïs, Soja, Maraîchage',
    adminUserId: 'demo_coop_admin',
  })

  // Admin coopérative
  DataService.create('users', {
    id: 'demo_coop_admin',
    nom: 'AMEGAVI',
    prenom: 'Ama',
    email: 'coop@agrifin.tg',
    password: 'coop1234',
    telephone: '+228 91 00 00 00',
    role: 'cooperative',
    cooperativeId: 'demo_coop_001',
  })

  localStorage.setItem('agrifin_demo_loaded', 'true')
}

export function clearDemoData() {
  DataService.clearAll()
  localStorage.removeItem('agrifin_demo_loaded')
  localStorage.removeItem('agrifin_session')
}
