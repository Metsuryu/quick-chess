import { useState, useCallback, useMemo, useEffect } from "react"
import { Chess } from 'chess.js'

export function useChessGame() {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [turn, setTurn] = useState('w');
  const [moveHistory, setMoveHistory] = useState([]);
  
  const moveSound = useMemo(() => new Audio('/move.ogg'), []);
  
  useEffect(() => {
    moveSound.preload = 'auto';
  }, [moveSound]);
  
  const movePiece = useCallback((move) => {
    try {
      chess.move(move);
      moveSound.play();
      setBoard(chess.board());
      setMoveHistory(prevHistory => [...prevHistory, move]);
      setTurn(chess.turn());
      return true;
    } catch (err) {
      return false;
    }
  }, [chess, moveSound]);
  
  const undoMove = () => {
    chess.undo();
    setBoard(chess.board());
    setMoveHistory(moveHistory.slice(0, -1));
    setTurn(chess.turn());
  };
  
  return {
    chess,
    board,
    turn,
    moveHistory,
    movePiece,
    undoMove
  };
} 