import { getStorageItem, setStorageItem } from '../utils/storage';

export const galleryService = {
  getAlbums: () => {
    return getStorageItem('cpp_gallery', []);
  },

  getAlbumById: (id) => {
    const albums = getStorageItem('cpp_gallery', []);
    return albums.find(a => a.id === id) || null;
  },

  createAlbum: (albumData) => {
    const albums = getStorageItem('cpp_gallery', []);
    const newAlbum = {
      id: `gal_${Date.now()}`,
      items: [],
      ...albumData
    };
    const updated = [newAlbum, ...albums];
    setStorageItem('cpp_gallery', updated);
    return newAlbum;
  },

  updateAlbum: (id, albumData) => {
    const albums = getStorageItem('cpp_gallery', []);
    const updated = albums.map(a => {
      if (a.id === id) {
        return { ...a, ...albumData };
      }
      return a;
    });
    setStorageItem('cpp_gallery', updated);
    return updated.find(a => a.id === id);
  },

  deleteAlbum: (id) => {
    const albums = getStorageItem('cpp_gallery', []);
    const filtered = albums.filter(a => a.id !== id);
    setStorageItem('cpp_gallery', filtered);
    return true;
  },

  addMediaItem: (albumId, itemData) => {
    const albums = getStorageItem('cpp_gallery', []);
    const updated = albums.map(a => {
      if (a.id === albumId) {
        const newItem = {
          id: `item_${Date.now()}`,
          ...itemData
        };
        return { ...a, items: [...a.items, newItem] };
      }
      return a;
    });
    setStorageItem('cpp_gallery', updated);
    return updated.find(a => a.id === albumId);
  },

  removeMediaItem: (albumId, itemId) => {
    const albums = getStorageItem('cpp_gallery', []);
    const updated = albums.map(a => {
      if (a.id === albumId) {
        const filteredItems = a.items.filter(item => item.id !== itemId);
        return { ...a, items: filteredItems };
      }
      return a;
    });
    setStorageItem('cpp_gallery', updated);
    return updated.find(a => a.id === albumId);
  }
};

export default galleryService;
