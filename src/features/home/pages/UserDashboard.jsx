import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getStorageItem, setStorageItem } from '../../../utils/storage';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import { Bookmark, Eye, Download, BookOpen, Clock, Activity } from 'lucide-react';
import './UserDashboard.css';

export const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Get saved papers
      const allBookmarks = getStorageItem('cpp_bookmarks', {});
      setBookmarks(allBookmarks[user.email] || []);

      // Get download logs
      const allLogs = getStorageItem('cpp_logs', []);
      const userLogs = allLogs.filter(log => log.userEmail === user.email);
      setLogs(userLogs);
    }
  }, [user]);

  const handleRemoveBookmark = (paperId) => {
    if (!user) return;
    const allBookmarks = getStorageItem('cpp_bookmarks', {});
    const updated = bookmarks.filter(p => p.id !== paperId);
    allBookmarks[user.email] = updated;
    setStorageItem('cpp_bookmarks', allBookmarks);
    setBookmarks(updated);
  };

  return (
    <div className="user-dashboard-view animate-fade-in">
      <div className="user-stats-row grid-3">
        <div className="user-stat-box glass">
          <BookOpen className="box-icon" />
          <div>
            <h3>{bookmarks.length}</h3>
            <p>Saved Publications</p>
          </div>
        </div>

        <div className="user-stat-box glass">
          <Activity className="box-icon text-secondary" />
          <div>
            <h3>{logs.length}</h3>
            <p>Total Downloads</p>
          </div>
        </div>

        <div className="user-stat-box glass">
          <Clock className="box-icon text-success" />
          <div>
            <p className="joined-date-text">Joined</p>
            <h3>{user?.joinedDate || 'Recent'}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-section mt-3">
        <div className="flex-between section-header border-b">
          <h2>My Bookmarked Papers</h2>
          <Link to="/papers" className="btn btn-secondary btn-small">Browse More</Link>
        </div>

        {bookmarks.length === 0 ? (
          <EmptyState 
            title="Your library is empty" 
            message="Publications you bookmark will be displayed here for quick access."
            icon={Bookmark}
          />
        ) : (
          <div className="bookmarks-grid grid-2 mt-2">
            {bookmarks.map(paper => (
              <div key={paper.id} className="bookmark-card glass flex-between">
                <div className="bookmark-card-details">
                  <span className="badge badge-info">{paper.category}</span>
                  <h4 onClick={() => navigate(`/papers/${paper.id}`)}>{paper.title}</h4>
                  <p className="bookmark-authors">By {paper.authors}</p>
                </div>
                <div className="bookmark-card-actions">
                  <Button 
                    variant="primary" 
                    size="small" 
                    onClick={() => navigate(`/papers/${paper.id}`)}
                    icon={Eye}
                  >
                    View PDF
                  </Button>
                  <button 
                    onClick={() => handleRemoveBookmark(paper.id)}
                    className="remove-bookmark-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
