/**
 * PDFService — Génération de documents PDF
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatMontant, formatDate, formatNombre } from '../utils/formatters'
import { DEVISE } from '../utils/constants'

const PDFService = {
  /**
   * Configuration commune du PDF
   */
  _initDoc(title) {
    const doc = new jsPDF()
    // Header
    doc.setFillColor(27, 94, 32) // Primary dark green
    doc.rect(0, 0, 210, 35, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('AgriFin', 15, 18)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(title, 15, 28)
    doc.setFontSize(8)
    doc.text(`Généré le ${formatDate(new Date().toISOString())}`, 195, 28, { align: 'right' })
    
    // Reset color
    doc.setTextColor(26, 26, 26)
    return doc
  },

  /**
   * Ajoute un avertissement
   */
  _addDisclaimer(doc, y) {
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text(
      'Ce document est généré automatiquement à partir des données déclarées par l\'utilisateur. Il ne constitue pas un document certifié.',
      105, y, { align: 'center', maxWidth: 180 }
    )
    return y + 10
  },

  /**
   * Compte d'exploitation
   */
  genererCompteExploitation(exploitation, depenses, recettes, periode) {
    const doc = this._initDoc("Compte d'exploitation")
    let y = 45

    // Infos exploitation
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(exploitation.nom || 'Mon exploitation', 15, y)
    y += 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 114, 128)
    if (exploitation.localisation) doc.text(`Localisation : ${exploitation.localisation}`, 15, y)
    if (exploitation.superficie) doc.text(`Superficie : ${exploitation.superficie} ha`, 120, y)
    y += 6
    if (periode) doc.text(`Période : ${periode}`, 15, y)
    y += 12

    doc.setTextColor(26, 26, 26)

    // Tableau des produits (recettes)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PRODUITS (Recettes)', 15, y)
    y += 4

    const recettesData = recettes.map(r => [
      formatDate(r.date),
      r.produit || '-',
      `${formatNombre(r.quantite)} ${r.unite || ''}`,
      formatMontant(r.montantTotal),
    ])

    const totalRecettes = recettes.reduce((s, r) => s + (Number(r.montantTotal) || 0), 0)
    recettesData.push(['', '', 'TOTAL PRODUITS', formatMontant(totalRecettes)])

    autoTable(doc, {
      startY: y,
      head: [['Date', 'Produit', 'Quantité', 'Montant']],
      body: recettesData,
      theme: 'striped',
      headStyles: { fillColor: [46, 125, 50], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      footStyles: { fillColor: [232, 245, 233], textColor: [27, 94, 32], fontStyle: 'bold' },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 10

    // Tableau des charges (dépenses)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('CHARGES (Dépenses)', 15, y)
    y += 4

    const depensesData = depenses.map(d => [
      formatDate(d.date),
      d.categorie || '-',
      d.description || '-',
      formatMontant(d.montant),
    ])

    const totalDepenses = depenses.reduce((s, d) => s + (Number(d.montant) || 0), 0)
    depensesData.push(['', '', 'TOTAL CHARGES', formatMontant(totalDepenses)])

    autoTable(doc, {
      startY: y,
      head: [['Date', 'Catégorie', 'Description', 'Montant']],
      body: depensesData,
      theme: 'striped',
      headStyles: { fillColor: [229, 57, 53], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 12

    // Résultat
    const resultat = totalRecettes - totalDepenses
    doc.setFillColor(resultat >= 0 ? 232 : 255, resultat >= 0 ? 245 : 235, resultat >= 0 ? 233 : 238)
    doc.roundedRect(15, y, 180, 25, 3, 3, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(resultat >= 0 ? 27 : 229, resultat >= 0 ? 94 : 57, resultat >= 0 ? 32 : 53)
    doc.text('RÉSULTAT', 25, y + 10)
    doc.setFontSize(16)
    doc.text(formatMontant(resultat), 185, y + 16, { align: 'right' })

    this._addDisclaimer(doc, y + 40)

    return doc
  },

  /**
   * Rapport de campagne
   */
  genererRapportCampagne(campagne, exploitation, depenses, recettes, productions) {
    const doc = this._initDoc(`Rapport de campagne — ${campagne.nom || ''}`)
    let y = 45

    // Info campagne
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(campagne.nom || 'Campagne', 15, y)
    y += 10

    const infos = [
      ['Culture', campagne.culture || '-'],
      ['Parcelle', campagne.parcelleName || '-'],
      ['Superficie', `${campagne.superficie || '-'} ha`],
      ['Début', formatDate(campagne.dateDebut)],
      ['Fin prévue', formatDate(campagne.dateFinPrevue)],
      ['Statut', campagne.statut || '-'],
    ]

    autoTable(doc, {
      startY: y,
      body: infos,
      theme: 'plain',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 10

    const totalDep = depenses.reduce((s, d) => s + (Number(d.montant) || 0), 0)
    const totalRec = recettes.reduce((s, r) => s + (Number(r.montantTotal) || 0), 0)
    const resultat = totalRec - totalDep

    // Résumé financier
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Résumé Financier', 15, y)
    y += 4

    autoTable(doc, {
      startY: y,
      body: [
        ['Total des dépenses', formatMontant(totalDep)],
        ['Total des recettes', formatMontant(totalRec)],
        ['Résultat', formatMontant(resultat)],
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 10 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 100 },
        1: { halign: 'right' },
      },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 10

    this._addDisclaimer(doc, y + 10)

    return doc
  },

  /**
   * Synthèse de l'exploitation
   */
  genererSyntheseExploitation(exploitation, user, stats, campagnes) {
    const doc = this._initDoc("Synthèse de l'exploitation")
    let y = 45

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(exploitation.nom || 'Mon exploitation', 15, y)
    y += 12

    // Identité
    doc.setFontSize(11)
    doc.text("Identité de l'exploitant", 15, y)
    y += 4

    const identite = [
      ['Nom complet', `${user.prenom || ''} ${user.nom || ''}`],
      ['Téléphone', user.telephone || '-'],
      ['Localisation', user.localisation || '-'],
      ['Commune', user.commune || '-'],
    ]

    autoTable(doc, {
      startY: y,
      body: identite,
      theme: 'plain',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 8

    // Info exploitation
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text("Informations de l'exploitation", 15, y)
    y += 4

    const exploitInfos = [
      ["Type d'activité", exploitation.typeActivite || '-'],
      ['Superficie totale', `${exploitation.superficie || '-'} ha`],
      ['Nombre de parcelles', `${exploitation.nombreParcelles || '-'}`],
      ['Cultures', exploitation.cultures || '-'],
      ['Élevage', exploitation.elevage || '-'],
    ]

    autoTable(doc, {
      startY: y,
      body: exploitInfos,
      theme: 'plain',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 8

    // Performance financière
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Performance financière', 15, y)
    y += 4

    autoTable(doc, {
      startY: y,
      body: [
        ['Total des dépenses', formatMontant(stats.depenses)],
        ['Total des recettes', formatMontant(stats.recettes)],
        ['Résultat', formatMontant(stats.resultat)],
        ['Campagnes actives', `${stats.campagnesActives}`],
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 100 },
        1: { halign: 'right' },
      },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 8

    // Historique campagnes
    if (campagnes && campagnes.length > 0) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Historique des campagnes', 15, y)
      y += 4

      const campData = campagnes.map(c => [
        c.nom || '-',
        c.culture || '-',
        `${c.superficie || '-'} ha`,
        formatMontant(c.depenses),
        formatMontant(c.recettes),
        formatMontant(c.resultat),
      ])

      autoTable(doc, {
        startY: y,
        head: [['Campagne', 'Culture', 'Superficie', 'Dépenses', 'Recettes', 'Résultat']],
        body: campData,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 15, right: 15 },
      })

      y = doc.lastAutoTable.finalY + 10
    }

    this._addDisclaimer(doc, y + 5)

    return doc
  },

  /**
   * Synthèse de financement
   */
  genererSyntheseFinancement(demande, exploitation, user, stats, campagnes) {
    const doc = this._initDoc('Synthèse pour demande de financement')
    let y = 45

    // Avertissement
    doc.setFillColor(255, 243, 224)
    doc.roundedRect(15, y, 180, 18, 3, 3, 'F')
    doc.setFontSize(8)
    doc.setTextColor(251, 140, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMATION IMPORTANTE', 25, y + 6)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 100, 0)
    doc.text(
      "Ce document présente les informations enregistrées dans votre exploitation. Il ne garantit pas l'obtention d'un financement.",
      25, y + 12, { maxWidth: 160 }
    )
    y += 25

    doc.setTextColor(26, 26, 26)

    // Demande
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Objet de la demande', 15, y)
    y += 4

    autoTable(doc, {
      startY: y,
      body: [
        ['Montant recherché', formatMontant(demande.montant)],
        ['Objet', demande.objet || '-'],
        ['Activité concernée', demande.activite || '-'],
        ['Durée souhaitée', demande.duree || '-'],
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 80 } },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 10

    // Reuse synthese exploitation logic
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text("Profil de l'exploitation", 15, y)
    y += 4

    autoTable(doc, {
      startY: y,
      body: [
        ['Exploitant', `${user.prenom || ''} ${user.nom || ''}`],
        ['Exploitation', exploitation.nom || '-'],
        ["Type d'activité", exploitation.typeActivite || '-'],
        ['Superficie', `${exploitation.superficie || '-'} ha`],
        ['Localisation', exploitation.localisation || user.localisation || '-'],
      ],
      theme: 'plain',
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 8

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Situation financière', 15, y)
    y += 4

    autoTable(doc, {
      startY: y,
      body: [
        ['Total des recettes', formatMontant(stats.recettes)],
        ['Total des dépenses', formatMontant(stats.depenses)],
        ['Résultat net', formatMontant(stats.resultat)],
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 10 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 100 },
        1: { halign: 'right' },
      },
      margin: { left: 15, right: 15 },
    })

    y = doc.lastAutoTable.finalY + 10

    this._addDisclaimer(doc, y + 5)

    return doc
  },

  /**
   * Télécharge un PDF
   */
  download(doc, filename) {
    doc.save(filename)
  },
}

export default PDFService
