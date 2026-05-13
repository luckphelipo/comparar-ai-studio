import { createContext, useContext, useState, useEffect } from 'react';

const RoteiroContext = createContext(null);

export function RoteiroProvider({ children }) {
  const [resultado, setResultado] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roteiroResultado'));
    } catch {
      return null;
    }
  });
  const [roteiroOriginal, setRoteiroOriginal] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roteiroOriginal'));
    } catch {
      return null;
    }
  });
  const [roteiroOtimizado, setRoteiroOtimizado] = useState(null);
  const [sugestoesTitulo, setSugestoesTitulo] = useState(null);

  useEffect(() => {
    localStorage.setItem('roteiroResultado', JSON.stringify(resultado));
  }, [resultado]);

  useEffect(() => {
    localStorage.setItem('roteiroOriginal', JSON.stringify(roteiroOriginal));
  }, [roteiroOriginal]);

  return (
    <RoteiroContext.Provider value={{
      resultado, setResultado,
      roteiroOriginal, setRoteiroOriginal,
      roteiroOtimizado, setRoteiroOtimizado,
      sugestoesTitulo, setSugestoesTitulo,
    }}>
      {children}
    </RoteiroContext.Provider>
  );
}

export function useRoteiro() {
  return useContext(RoteiroContext);
}