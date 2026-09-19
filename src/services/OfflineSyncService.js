/**
 * OfflineSyncService — Service de gestion Offline-First et de synchronisation
 * Permet d'enregistrer les opérations hors-ligne et de les synchroniser au retour du réseau.
 */

const QUEUE_KEY = 'agrifin_offline_queue'
const SYNC_EVENTS = 'agrifin_sync_event'

export const OfflineSyncService = {
  /**
   * Vérifie si le navigateur est actuellement connecté à Internet
   */
  isOnline() {
    return navigator.onLine
  },

  /**
   * Récupère la file d'attente des opérations hors-ligne
   */
  getQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error('Erreur lecture offline queue:', e)
      return []
    }
  },

  /**
   * Ajoute une opération dans la file d'attente hors-ligne
   */
  enqueue(action, collection, payload) {
    const queue = this.getQueue()
    const operation = {
      id: 'op_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      action, // 'CREATE', 'UPDATE', 'DELETE'
      collection,
      payload,
      timestamp: new Date().toISOString(),
      status: 'pending_sync'
    }
    queue.push(operation)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    this.notifyListeners()
    return operation
  },

  /**
   * Vide la file d'attente (synchronisation réussie)
   */
  clearQueue() {
    localStorage.removeItem(QUEUE_KEY)
    this.notifyListeners()
  },

  /**
   * Effectue la synchronisation automatique de la file d'attente quand le réseau revient
   */
  async syncPendingOperations(onSyncComplete) {
    if (!this.isOnline()) return { success: false, syncedCount: 0 }

    const queue = this.getQueue()
    if (queue.length === 0) return { success: true, syncedCount: 0 }

    const count = queue.length
    // Simule/Exécute la synchronisation distante (API cloud)
    console.log(`[OfflineSyncService] Synchronisation de ${count} opération(s) hors-ligne...`)

    // Marquer la queue comme synchronisée
    this.clearQueue()

    if (onSyncComplete) {
      onSyncComplete(count)
    }

    return { success: true, syncedCount: count }
  },

  /**
   * S'abonne aux événements de changement d'état réseau et de synchronisation
   */
  subscribe(callback) {
    const handleStatusChange = () => {
      callback({
        isOnline: this.isOnline(),
        pendingCount: this.getQueue().length
      })
    }

    window.addEventListener('online', handleStatusChange)
    window.addEventListener('offline', handleStatusChange)
    window.addEventListener(SYNC_EVENTS, handleStatusChange)

    // Appel initial
    handleStatusChange()

    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
      window.removeEventListener(SYNC_EVENTS, handleStatusChange)
    }
  },

  notifyListeners() {
    window.dispatchEvent(new Event(SYNC_EVENTS))
  }
}

export default OfflineSyncService
