import React from 'react';
import { AdminTab, TabConfig } from '../models/AdminModel';

interface AdminTabsProps {
  tabs: TabConfig[];
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

/**
 * Componente puro de navegação por abas
 */
export const AdminTabs: React.FC<AdminTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="admin-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};