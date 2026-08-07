import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getStorageItem } from '../../../utils/storage';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import { Clock, Activity, FileText } from 'lucide-react';
import './DownloadHistory.css';

export const DownloadHistory = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (user) {
      const allLogs = getStorageItem('cpp_logs', []);
      const userLogs = allLogs.filter(log => log.userEmail === user.email);
      setLogs(userLogs);
    }
  }, [user]);

  return (
    <div className="download-history-view animate-fade-in">
      <div className="flex-between section-header border-b">
        <h2>Download Activity Logs</h2>
        <span className="badge badge-info flex-align">
          <Activity size={12} /> {logs.length} Total Logs
        </span>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          title="No download activities recorded"
          message="When you access full research papers, download timestamps are cataloged here."
          icon={Clock}
        />
      ) : (
        <div className="logs-table-wrapper mt-2">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Resource Title</th>
                <th className="text-right">Access Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="log-title-cell flex-align">
                    <FileText size={16} className="text-secondary" />
                    <span>{log.paperTitle}</span>
                  </td>
                  <td className="log-date-cell text-right">
                    {log.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;
