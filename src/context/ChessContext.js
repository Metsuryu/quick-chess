import React, { createContext, useContext } from 'react';
import { useChessGame } from '../hooks/useChessGame';

const ChessContext = createContext();

export function ChessProvider({ children }) {
  const chessGame = useChessGame();
  
  return (
    <ChessContext.Provider value={chessGame}>
      {children}
    </ChessContext.Provider>
  );
}

export function useChessContext() {
  return useContext(ChessContext);
} 