import { useBookmarksContext } from '@/context/BookmarksContext';

export const useBookmarks = () => {
  return useBookmarksContext();
};
