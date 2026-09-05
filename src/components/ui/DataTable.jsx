import React from 'react'
import EmptyState from './EmptyState'

export default function DataTable({ columns, data, emptyTitle = 'Aucune donnée disponible', emptyDescription = 'Commencez par ajouter un enregistrement.' }) {
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyDescription} />
  }

  return (
    <div className="table-container">
      <table className="table-responsive">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  data-label={col.header}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
