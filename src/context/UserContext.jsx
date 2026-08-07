import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [savedPapers, setSavedPapers] = useState([]);
  const [downloadLogs, setDownloadLogs] = useState([]);

  // Load user data on login/logout
  useEffect(() => {
    if (user) {
      const allBookmarks = getStorageItem('cpp_bookmarks', {});
      setSavedPapers(allBookmarks[user.email] || []);
      
      const allLogs = getStorageItem('cpp_logs', []);
      const userLogs = allLogs.filter(log => log.userEmail === user.email);
      setDownloadLogs(userLogs);
    } else {
      setSavedPapers([]);
      setDownloadLogs([]);
    }
  }, [user]);

  const toggleBookmark = (paper) => {
    if (!user) return;
    const allBookmarks = getStorageItem('cpp_bookmarks', {});
    const userBookmarks = allBookmarks[user.email] || [];
    
    const exists = userBookmarks.some(p => p.id === paper.id);
    let updated;
    if (exists) {
      updated = userBookmarks.filter(p => p.id !== paper.id);
    } else {
      updated = [...userBookmarks, paper];
    }
    
    allBookmarks[user.email] = updated;
    setStorageItem('cpp_bookmarks', allBookmarks);
    setSavedPapers(updated);
  };

  const isBookmarked = (paperId) => {
    return savedPapers.some(p => p.id === paperId);
  };

  const recordDownload = (paper) => {
    if (!user) return;
    const allLogs = getStorageItem('cpp_logs', []);
    const newLog = {
      id: `log_${Date.now()}`,
      userEmail: user.email,
      paperTitle: paper.title,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    const updatedLogs = [newLog, ...allLogs];
    setStorageItem('cpp_logs', updatedLogs);
    setDownloadLogs(prev => [newLog, ...prev]);

    // Also update paper download count
    const allPapers = getStorageItem('cpp_papers', []);
    const updatedPapers = allPapers.map(p => {
      if (p.id === paper.id) {
        return { ...p, downloads: (p.downloads || 0) + 1 };
      }
      return p;
    });
    setStorageItem('cpp_papers', updatedPapers);
  };

  return (
    <UserContext.Provider value={{
      savedPapers,
      downloadLogs,
      toggleBookmark,
      isBookmarked,
      recordDownload
    }}>
      {children}
    </UserContext.Provider>
  );
};
