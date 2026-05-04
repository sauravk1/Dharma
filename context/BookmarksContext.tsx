import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

interface BookmarksContextType {
  bookmarks: string[];
  toggleBookmark: (id: string) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  clearBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const stored = await storage.getItem('bookmarks');
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  };

  const toggleBookmark = async (id: string) => {
    setBookmarks(prev => {
      let newBookmarks = [...prev];
      if (newBookmarks.includes(id)) {
        newBookmarks = newBookmarks.filter(b => b !== id);
      } else {
        newBookmarks.push(id);
      }
      storage.setItem('bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const clearBookmarks = async () => {
    setBookmarks([]);
    await storage.removeItem('bookmarks');
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarksContext must be used within a BookmarksProvider');
  }
  return context;
};
