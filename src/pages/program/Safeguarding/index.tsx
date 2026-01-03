/**
 * Safeguarding Module - Placeholder
 * TODO: Implement full CRUD similar to other modules
 */

import { Link } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';

export const SafeguardingList = () => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Safeguarding</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage safeguarding activities
        </p>
      </div>
      <Link
        to="/program/safeguarding/new"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="h-5 w-5" />
        New Activity
      </Link>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
      <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Safeguarding module coming soon</p>
    </div>
  </div>
);

export const SafeguardingForm = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Safeguarding Form</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
      <p className="text-gray-600 dark:text-gray-400">Safeguarding form coming soon</p>
      <Link to="/program/safeguarding" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
        Back to Safeguarding
      </Link>
    </div>
  </div>
);

export const SafeguardingView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Safeguarding Details</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
      <p className="text-gray-600 dark:text-gray-400">Safeguarding view coming soon</p>
      <Link to="/program/safeguarding" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
        Back to Safeguarding
      </Link>
    </div>
  </div>
);
