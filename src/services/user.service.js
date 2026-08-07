import { getStorageItem, setStorageItem } from '../utils/storage';

export const userService = {
  getUsers: () => {
    return getStorageItem('cpp_users', []);
  },

  updateUserStatus: (id, status) => {
    const users = getStorageItem('cpp_users', []);
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, status };
      }
      return u;
    });
    setStorageItem('cpp_users', updated);
    return updated.find(u => u.id === id);
  },

  updateUserRole: (id, role) => {
    const users = getStorageItem('cpp_users', []);
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, role };
      }
      return u;
    });
    setStorageItem('cpp_users', updated);
    return updated.find(u => u.id === id);
  },

  getDownloadLogs: () => {
    return getStorageItem('cpp_logs', []);
  }
};

export default userService;
