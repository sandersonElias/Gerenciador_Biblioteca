import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import './Loading.scss';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = prev + 1;
      if (newCount === 1) setIsLoading(true);
      return newCount;
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) setIsLoading(false);
      return newCount;
    });
  }, []);

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    showLoading();
    try {
      const result = await promise;
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
      {children}
      {isLoading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
