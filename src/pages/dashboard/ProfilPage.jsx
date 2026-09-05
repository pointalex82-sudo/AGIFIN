import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { User, Save, Phone, Mail, MapPin } from 'lucide-react'

export default function ProfilPage() {
  const { user, updateProfile } = useAuth()
  const { addToast } = useNotification()

  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    telephone: user?.telephone || '',
    email: user?.email || '',
    localisation: user?.localisation || '',
    commune: user?.commune || '',
    village: user?.village || '',
    statut: user?.statut || 'Exploitant individuel',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    addToast('Profil mis à jour avec succès', 'success')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Profil Utilisateur</h1>
        <p className="page-subtitle">Gérez vos informations personnelles et vos coordonnées.</p>
      </div>

      <div className="card card-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Téléphone / WhatsApp *</label>
              <input
                type="tel"
                className="form-input"
                required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Région / Préfecture</label>
              <input
                type="text"
                className="form-input"
                value={formData.localisation}
                onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                placeholder="ex: Région Maritime / Zio"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Commune</label>
              <input
                type="text"
                className="form-input"
                value={formData.commune}
                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                placeholder="ex: Tsévié"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Village / Quartier</label>
            <input
              type="text"
              className="form-input"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              placeholder="ex: Aképé"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} /> Enregistrer le profil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
