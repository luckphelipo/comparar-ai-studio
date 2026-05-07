import { createContext, useContext, useState } from 'react';

const RoteiroContext = createContext(null);

export function RoteiroProvider({ children }) {
  const [resultado, setResultado] = useState(null);
  const [roteiroOriginal, setRoteiroOriginal] = useState(null);
  const [roteiroOtimizado, setRoteiroOtimizado] = useState(null);
  const [sugestoesTitulo, setSugestoesTitulo] = useState(null);

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