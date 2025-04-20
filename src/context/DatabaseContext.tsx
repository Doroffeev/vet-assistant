import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initDatabase } from '../database/DatabaseService';

interface DatabaseContextType {
  isDbReady: boolean;
  refreshDb: () => void;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isDbReady: false,
  refreshDb: () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      console.log('DatabaseProvider: Starting database initialization');
      try {
        await initDatabase();
        console.log('DatabaseProvider: Database initialized successfully');
        setIsDbReady(true);
      } catch (error) {
        console.error('DatabaseProvider: Failed to initialize database:', error);
      }
    };

    setupDb();
  }, []);

  const refreshDb = () => {
    setIsDbReady(false);
    const setupDb = async () => {
      try {
        await initDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to reinitialize database:', error);
      }
    };
    setupDb();
  };

  return (
    <DatabaseContext.Provider value={{ isDbReady, refreshDb }}>
      {children}
    </DatabaseContext.Provider>
  );
};