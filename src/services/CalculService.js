/**
 * CalculService — Calculs financiers et de rentabilité
 */

import DataService from './DataService'

const CalculService = {
  /**
   * Total des dépenses pour un utilisateur
   */
  totalDepenses(userId, filters = {}) {
    return DataService.aggregate('depenses', 'montant', 'sum', { userId, ...filters })
  },

  /**
   * Total des recettes pour un utilisateur
   */
  totalRecettes(userId, filters = {}) {
    return DataService.aggregate('recettes', 'montantTotal', 'sum', { userId, ...filters })
  },

  /**
   * Solde (recettes - dépenses)
   */
  solde(userId, filters = {}) {
    return this.totalRecettes(userId, filters) - this.totalDepenses(userId, filters)
  },

  /**
   * Résultats d'une campagne
   */
  resultatCampagne(userId, campagneId) {
    const depenses = this.totalDepenses(userId, { campagneId })
    const recettes = this.totalRecettes(userId, { campagneId })
    const resultat = recettes - depenses
    const marge = recettes > 0 ? (resultat / recettes) * 100 : 0
    const rentabilite = depenses > 0 ? (resultat / depenses) * 100 : 0

    return {
      depenses,
      recettes,
      resultat,
      marge,
      rentabilite,
    }
  },

  /**
   * Résultats d'un cycle d'élevage
   */
  resultatCycle(userId, cycleId) {
    const depenses = this.totalDepenses(userId, { cycleId })
    const recettes = this.totalRecettes(userId, { cycleId })
    const resultat = recettes - depenses
    const marge = recettes > 0 ? (resultat / recettes) * 100 : 0
    const rentabilite = depenses > 0 ? (resultat / depenses) * 100 : 0

    return {
      depenses,
      recettes,
      resultat,
      marge,
      rentabilite,
    }
  },

  /**
   * Répartition des dépenses par catégorie
   */
  repartitionDepenses(userId, filters = {}) {
    const depenses = DataService.list('depenses', { userId, ...filters })
    const repartition = {}
    depenses.forEach(d => {
      const cat = d.categorie || 'autres'
      repartition[cat] = (repartition[cat] || 0) + (Number(d.montant) || 0)
    })
    return repartition
  },

  /**
   * Statistiques globales du tableau de bord
   */
  statsGlobales(userId) {
    const depenses = this.totalDepenses(userId)
    const recettes = this.totalRecettes(userId)
    const resultat = recettes - depenses
    const campagnesActives = DataService.list('campagnes', { userId }).filter(
      c => c.statut === 'en_cours'
    ).length
    const cyclesActifs = DataService.list('cycles_elevage', { userId }).filter(
      c => c.statut === 'en_cours'
    ).length
    const productions = DataService.list('productions', { userId })
    const totalProduction = productions.reduce((sum, p) => sum + (Number(p.quantite) || 0), 0)

    return {
      depenses,
      recettes,
      resultat,
      campagnesActives,
      cyclesActifs,
      totalProduction,
    }
  },

  /**
   * Comparaison de campagnes
   */
  comparerCampagnes(userId) {
    const campagnes = DataService.list('campagnes', { userId })
    return campagnes.map(c => ({
      ...c,
      ...this.resultatCampagne(userId, c.id),
    }))
  },

  /**
   * Données pour les graphiques mensuels
   */
  donneesMenuelles(userId, annee) {
    const mois = Array.from({ length: 12 }, (_, i) => i)
    const depenses = DataService.list('depenses', { userId })
    const recettes = DataService.list('recettes', { userId })

    const depensesMensuelles = mois.map(m => {
      return depenses
        .filter(d => {
          const date = new Date(d.date)
          return date.getFullYear() === annee && date.getMonth() === m
        })
        .reduce((sum, d) => sum + (Number(d.montant) || 0), 0)
    })

    const recettesMensuelles = mois.map(m => {
      return recettes
        .filter(r => {
          const date = new Date(r.date)
          return date.getFullYear() === annee && date.getMonth() === m
        })
        .reduce((sum, r) => sum + (Number(r.montantTotal) || 0), 0)
    })

    return {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      depenses: depensesMensuelles,
      recettes: recettesMensuelles,
    }
  },
}

export default CalculService
