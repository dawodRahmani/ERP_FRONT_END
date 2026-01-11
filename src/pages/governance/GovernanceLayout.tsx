/**
 * Governance Layout
 *
 * Main layout component with tab navigation for Governance module.
 * Provides navigation between Board Members, Board Meetings, and Correspondence.
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, FileText } from 'lucide-react';

const GovernanceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'board-members',
      label: 'Board Members',
      icon: Users,
      path: '/governance/board-members',
    },
    {
      id: 'board-meetings',
      label: 'Board Meetings',
      icon: Calendar,
      path: '/governance/board-meetings',
    },
    {
      id: 'correspondence',
      label: 'Correspondence',
      icon: FileText,
      path: '/governance/correspondence',
    },
  ];

  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path))?.id || 'board-members';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Governance Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage board members, meetings, and correspondence
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <Outlet />
    </div>
  );
};

export default GovernanceLayout;
