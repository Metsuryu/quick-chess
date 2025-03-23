import { useState } from "react"
import { Chess } from 'chess.js'

export function useChessGame() {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [turn, setTurn] = useState('w');
  const [moveHistory, setMoveHistory] = useState([]);
  
  const movePiece = (move) => {
    try {
      chess.move(move);
      setBoard(chess.board());
      setMoveHistory([...moveHistory, move]);
      setTurn(chess.turn());
      return true;
    } catch (err) {
      return false;
    }
  };
  
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