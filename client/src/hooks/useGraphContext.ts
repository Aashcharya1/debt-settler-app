import { useContext } from 'react';
import { GraphContext } from '@/contexts/GraphContext';

export const useGraphContext = () => {
  const context = useContext(GraphContext);

  if (context === undefined) {
    throw new Error('useGraphContext must be used within a GraphProvider');
  }

  return context;
};
