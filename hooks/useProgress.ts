import { useProgressContext } from '@/context/ProgressContext';

export const useProgress = () => {
  return useProgressContext();
};
