import { initializeStorage, getStorageItem, setStorageItem } from '../utils/storage';

// Ensure storage is initialized on import
initializeStorage();

export const apiDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export { getStorageItem, setStorageItem };
