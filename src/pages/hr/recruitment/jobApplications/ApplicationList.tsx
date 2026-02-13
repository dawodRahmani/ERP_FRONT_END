import { useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formStyles as s } from './styles';

const ApplicationList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={s.page}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={s.title}>Job Applications</h1>
          <p className={s.subtitle}>Annex 4: Manage candidate applications</p>
        </div>
        <Link
          to="/hr/recruitment/applications/new"
          className={s.primaryButton}
        >
          <Plus className="h-4 w-4" />
          New Application
        </Link>
      </div>

      <div className={s.searchWrapper}>
        <Search className={s.searchIcon} />
        <input
          type="text"
          placeholder="Search by name or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={s.searchInput}
        />
      </div>

      <div className={`${s.card} overflow-hidden`}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Candidate</th>
              <th className={s.th}>Position</th>
              <th className={s.th}>Nationality</th>
              <th className={s.th}>Phone</th>
              <th className={s.th}>Applied</th>
              <th className={`${s.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No applications found</p>
                <Link
                  to="/hr/recruitment/applications/new"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  <Plus className="h-4 w-4" />
                  Add New Application
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
