import { useState } from 'react';
import { Plus, Search, FileText, Eye, Download, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coiStyles as s } from './styles';

const COIList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={s.page}>
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={s.title}>Conflict of Interest Declarations</h1>
          <p className={s.subtitle}>Annex 5: RC member COI declarations — upload and download per member</p>
        </div>
        <Link
          to="/hr/recruitment/conflict-of-interest/new"
          className={s.primaryButton}
        >
          <Plus className="h-4 w-4" />
          New Declaration
        </Link>
      </div>

      {/* ─── Search ─── */}
      <div className={s.searchWrapper}>
        <Search className={s.searchIcon} />
        <input
          type="text"
          placeholder="Search by member name or vacancy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={s.searchInput}
        />
      </div>

      {/* ─── Table ─── */}
      <div className={`${s.card} overflow-hidden`}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Member</th>
              <th className={s.th}>Position in RC</th>
              <th className={s.th}>Recruitment Position</th>
              <th className={s.th}>Decision</th>
              <th className={s.th}>Files</th>
              <th className={s.th}>Date</th>
              <th className={`${s.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {/* Empty state — will be replaced when IndexedDB integration is wired */}
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  No COI declarations found
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Each committee member should submit one declaration per recruitment
                </p>
                <Link
                  to="/hr/recruitment/conflict-of-interest/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Create First Declaration
                </Link>
              </td>
            </tr>

            {/* Example row template (renders when data exists):
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className={s.td}>
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-gray-500">HR Department</div>
              </td>
              <td className={s.td}>Chair</td>
              <td className={s.td}>
                <div>Project Manager</div>
                <div className="text-xs text-gray-500">VA-2026-001</div>
              </td>
              <td className={s.td}>
                <span className={`${s.badgeBase} ${s.badgeNoConflict}`}>No Conflict</span>
              </td>
              <td className={s.td}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">2 files</span>
                  <button className="text-primary-500 hover:text-primary-600" title="Download all">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="text-primary-500 hover:text-primary-600" title="Upload">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </td>
              <td className={s.td}>2026-02-09</td>
              <td className={`${s.td} text-right`}>
                <Link to="/hr/recruitment/conflict-of-interest/1" className="text-primary-500 hover:text-primary-600">
                  <Eye className="h-4 w-4" />
                </Link>
              </td>
            </tr>
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COIList;
