import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import { governanceCorrespondenceDB } from '../../../services/db/governanceService';
import type { GovernanceCorrespondenceRecord } from '../../../types/modules/governance';

const CorrespondenceList = () => {
  const [correspondence, setCorrespondence] = useState<GovernanceCorrespondenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await governanceCorrespondenceDB.getAll();
      setCorrespondence(data);
    } catch (error) {
      console.error('Error loading correspondence:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-600 dark:text-gray-400">Loading...</div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Correspondence</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage incoming and outgoing correspondence</p>
        </div>
        <Link to="/governance/correspondence/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          New Correspondence
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {correspondence.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No correspondence found</h3>
            <p className="text-gray-600 dark:text-gray-400">Get started by adding your first correspondence</p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Showing {correspondence.length} correspondence records</p>
        )}
      </div>
    </div>
  );
};

export default CorrespondenceList;
