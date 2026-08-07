import React, { useState, useEffect } from 'react';
import { getStorageItem } from '../../../utils/storage';
import { FileText, Calendar, Users, Compass, Activity, Download } from 'lucide-react';
import './AdminPages.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ papers: 0, conferences: 0, workshops: 0, users: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Load counts
    const papers = getStorageItem('cpp_papers', []);
    const conferences = getStorageItem('cpp_conferences', []);
    const workshops = getStorageItem('cpp_workshops', []);
    const users = getStorageItem('cpp_users', []);
    const logs = getStorageItem('cpp_logs', []);

    setStats({
      papers: papers.length,
      conferences: conferences.length,
      workshops: workshops.length,
      users: users.length
    });

    setRecentLogs(logs.slice(0, 5));

    // Calculate category distribution
    const catCounts = papers.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const sortedCats = Object.entries(catCounts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / papers.length) * 100) }))
      .sort((a, b) => b.count - a.count);
      
    setCategoryData(sortedCats);
  }, []);

  return (
    <div className="admin-dashboard-view animate-fade-in">
      <div className="admin-stats-grid grid-4">
        <div className="admin-stat-card glass flex-align">
          <div className="stat-icon p-blue"><FileText size={20} /></div>
          <div>
            <h3 className="stat-value">{stats.papers}</h3>
            <p className="stat-lbl">Papers Uploaded</p>
          </div>
        </div>

        <div className="admin-stat-card glass flex-align">
          <div className="stat-icon p-green"><Calendar size={20} /></div>
          <div>
            <h3 className="stat-value">{stats.conferences}</h3>
            <p className="stat-lbl">Conferences Listed</p>
          </div>
        </div>

        <div className="admin-stat-card glass flex-align">
          <div className="stat-icon p-yellow"><Compass size={20} /></div>
          <div>
            <h3 className="stat-value">{stats.workshops}</h3>
            <p className="stat-lbl">Workshops Active</p>
          </div>
        </div>

        <div className="admin-stat-card glass flex-align">
          <div className="stat-icon p-purple"><Users size={20} /></div>
          <div>
            <h3 className="stat-value">{stats.users}</h3>
            <p className="stat-lbl">Total Researchers</p>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-layout-grid">
        {/* Recent logs */}
        <div className="logs-panel glass">
          <div className="panel-header border-b flex-align">
            <Activity size={18} className="panel-header-icon text-secondary" />
            <h3>Recent Resource Downloads</h3>
          </div>
          
          <div className="panel-body">
            {recentLogs.length === 0 ? (
              <p className="empty-logs text-center">No downloads logged yet.</p>
            ) : (
              <div className="logs-list-stack">
                {recentLogs.map((log) => (
                  <div key={log.id} className="log-row flex-between border-b">
                    <div className="log-info">
                      <p className="log-paper-title">{log.paperTitle}</p>
                      <p className="log-user-email">Accessed by: <strong>{log.userEmail}</strong></p>
                    </div>
                    <div className="log-timestamp flex-align">
                      <Download size={12} className="text-secondary" />
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category distribution visual */}
        <div className="categories-panel glass">
          <div className="panel-header border-b">
            <h3>Publications Category Scope</h3>
          </div>
          
          <div className="panel-body category-list">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="category-progress-row">
                <div className="category-meta flex-between">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count} papers ({cat.pct}%)</span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${cat.pct}%`,
                      background: `hsl(${220 + (idx * 25)}, 70%, 60%)` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
