import { DEVISE } from './constants'

/**
 * Formate un montant en FCFA
 */
export function formatMontant(montant) {
  if (montant === null || montant === undefined || isNaN(montant)) return `0 ${DEVISE}`
  const num = Number(montant)
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(num))
  return `${formatted} ${DEVISE}`
}

/**
 * Formate un nombre simple
 */
export function formatNombre(nombre) {
  if (nombre === null || nombre === undefined || isNaN(nombre)) return '0'
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(nombre))
}

/**
 * Formate une date en format français
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Formate une date courte
 */
export function formatDateCourte(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Formate une date relative (il y a X jours)
 */
export function formatDateRelative(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}

/**
 * Formate un pourcentage
 */
export function formatPourcentage(valeur) {
  if (valeur === null || valeur === undefined || isNaN(valeur)) return '0%'
  return `${Number(valeur).toFixed(1)}%`
}

/**
 * Formate une superficie en hectares
 */
export function formatSuperficie(ha) {
  if (!ha || isNaN(ha)) return '0 ha'
  return `${Number(ha).toFixed(2)} ha`
}

/**
 * Génère un ID unique
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * Obtient les initiales d'un nom
 */
export function getInitiales(nom, prenom) {
  const n = (nom || '').charAt(0).toUpperCase()
  const p = (prenom || '').charAt(0).toUpperCase()
  return `${p}${n}` || '?'
}

/**
 * Tronque un texte
 */
export function tronquer(texte, max = 50) {
  if (!texte) return ''
  if (texte.length <= max) return texte
  return texte.substring(0, max) + '...'
}

/**
 * Calcule le pourcentage de variation
 */
export function calculerVariation(ancien, nouveau) {
  if (!ancien || ancien === 0) return null
  return ((nouveau - ancien) / ancien) * 100
}
