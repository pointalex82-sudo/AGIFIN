import DataService from './DataService'

export const DEFAULT_ATELIERS = [
  { id: 'atl_mais_2026', nom: 'Atelier Maïs 2026', type: 'vegetal', culture: 'Maïs', icon: 'Sprout', description: 'Cultures de grain & semences maïs' },
  { id: 'atl_soja_2026', nom: 'Atelier Soja 2026', type: 'vegetal', culture: 'Soja', icon: 'Sun', description: 'Production de soja biologique' },
  { id: 'atl_volailles', nom: 'Atelier Volailles / Poulets', type: 'animal', elevage: 'Volailles', icon: 'Egg', description: 'Poulets de chair & pondeuses' },
  { id: 'atl_maraichage', nom: 'Atelier Maraîchage', type: 'vegetal', culture: 'Tomate / Piment', icon: 'Leaf', description: 'Culture légumière contre-saison' },
  { id: 'atl_porcin', nom: 'Atelier Élevage Porcin', type: 'animal', elevage: 'Porcins', icon: 'Beef', description: 'Engraissement & porcelets' },
  { id: 'atl_structure', nom: 'Frais Généraux & Structure', type: 'structure', icon: 'Building', description: 'Amortissements, carburant global, administratif' },
]

export const AtelierService = {
  /**
   * Initialise les ateliers par défaut pour l'utilisateur s'ils n'existent pas
   */
  initAteliers(userId) {
    const existing = DataService.list('ateliers', { userId })
    if (existing.length === 0) {
      DEFAULT_ATELIERS.forEach(atl => {
        DataService.create('ateliers', { ...atl, userId })
      })
    }
  },

  /**
   * Liste des ateliers de l'utilisateur
   */
  getAteliers(userId) {
    if (!userId) return DEFAULT_ATELIERS
    let list = DataService.list('ateliers', { userId })
    if (list.length === 0) {
      this.initAteliers(userId)
      list = DataService.list('ateliers', { userId })
    }
    return list.length > 0 ? list : DEFAULT_ATELIERS
  },

  /**
   * Calcule le Compte d'Exploitation Analytique d'un Atelier
   */
  getCompteAnalytiqueAtelier(userId, atelierId) {
    const recettes = DataService.list('recettes', { userId }).filter(r => r.atelierId === atelierId || (!r.atelierId && atelierId === 'atl_mais_2026'))
    const depenses = DataService.list('depenses', { userId }).filter(d => d.atelierId === atelierId || (!d.atelierId && atelierId === 'atl_mais_2026'))

    const totalRecettes = recettes.reduce((sum, r) => sum + (Number(r.montant) || 0), 0)
    const totalDepenses = depenses.reduce((sum, d) => sum + (Number(d.montant) || 0), 0)
    const margeNette = totalRecettes - totalDepenses
    const tauxMarge = totalRecettes > 0 ? ((margeNette / totalRecettes) * 100).toFixed(1) : 0

    return {
      atelierId,
      totalRecettes,
      totalDepenses,
      margeNette,
      tauxMarge,
      nombreRecettes: recettes.length,
      nombreDepenses: depenses.length
    }
  }
}

export default AtelierService
