/**
 * DataService — Couche d'abstraction au-dessus de localStorage
 * Peut être facilement remplacée par des appels API REST
 */

const PREFIX = 'agrifin_'

function getStore(collection) {
  const raw = localStorage.getItem(PREFIX + collection)
  return raw ? JSON.parse(raw) : []
}

function setStore(collection, data) {
  localStorage.setItem(PREFIX + collection, JSON.stringify(data))
}

const DataService = {
  /**
   * Crée un nouvel enregistrement
   */
  create(collection, data) {
    const items = getStore(collection)
    const newItem = {
      ...data,
      id: data.id || (Date.now().toString(36) + Math.random().toString(36).substr(2, 9)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    items.push(newItem)
    setStore(collection, items)
    return newItem
  },

  /**
   * Lit un enregistrement par ID
   */
  read(collection, id) {
    const items = getStore(collection)
    return items.find(item => item.id === id) || null
  },

  /**
   * Met à jour un enregistrement
   */
  update(collection, id, data) {
    const items = getStore(collection)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null
    items[index] = {
      ...items[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    }
    setStore(collection, items)
    return items[index]
  },

  /**
   * Supprime un enregistrement
   */
  delete(collection, id) {
    const items = getStore(collection)
    const filtered = items.filter(item => item.id !== id)
    setStore(collection, filtered)
    return filtered.length < items.length
  },

  /**
   * Liste avec filtres optionnels
   */
  list(collection, filters = {}) {
    let items = getStore(collection)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        items = items.filter(item => item[key] === value)
      }
    })
    
    // Tri par date de création décroissante par défaut
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return items
  },

  /**
   * Agrégation simple (somme, moyenne, count)
   */
  aggregate(collection, field, operation = 'sum', filters = {}) {
    const items = this.list(collection, filters)
    const values = items.map(item => Number(item[field]) || 0)
    
    switch (operation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0)
      case 'avg':
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
      case 'count':
        return items.length
      case 'min':
        return values.length > 0 ? Math.min(...values) : 0
      case 'max':
        return values.length > 0 ? Math.max(...values) : 0
      default:
        return 0
    }
  },

  /**
   * Vide une collection
   */
  clear(collection) {
    localStorage.removeItem(PREFIX + collection)
  },

  /**
   * Vide toutes les données
   */
  clearAll() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key))
  },

  /**
   * Exporte toutes les données
   */
  exportAll() {
    const data = {}
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => {
        data[key.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(key))
      })
    return data
  },

  /**
   * Importe des données
   */
  importAll(data) {
    Object.entries(data).forEach(([collection, items]) => {
      setStore(collection, items)
    })
  },
}

export default DataService
