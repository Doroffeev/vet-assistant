import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const DatabaseContext = createContext({ isDbReady: false });

// Хук для использования контекста
export const useDatabase = () => useContext(DatabaseContext);

// Провайдер контекста
export const DatabaseProvider = ({ children }) => {
  const [isDbReady, setIsDbReady] = useState(false);
  
  useEffect(() => {
    // Имитация инициализации БД
    setTimeout(() => {
      console.log('БД инициализирована');
      setIsDbReady(true);
    }, 1500);
  }, []);
  
  return (
    <DatabaseContext.Provider value={{ isDbReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};