import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Reusable data table with column sort support.
 *
 * @param {Array} columns - [{ key, label, sortable, render }]
 * @param {Array} rows
 * @param {string} sortBy
 * @param {string} order - 'ASC' | 'DESC'
 * @param {function} onSort - (key) => void
 */
export default function DataTable({ columns = [], rows = [], sortBy, order, onSort, emptyMsg = 'No data found.' }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="flex items-center gap-1 hover:text-primary-600 transition-colors group"
                  >
                    {col.label}
                    <span className="flex flex-col opacity-50 group-hover:opacity-100">
                      <ChevronUpIcon   className={`w-3 h-3 -mb-1 ${sortBy === col.key && order === 'ASC'  ? 'text-primary-500 opacity-100' : ''}`} />
                      <ChevronDownIcon className={`w-3 h-3 ${sortBy === col.key && order === 'DESC' ? 'text-primary-500 opacity-100' : ''}`} />
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-400">
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
