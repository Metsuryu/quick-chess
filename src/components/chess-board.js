import * as React from "react";
import "./chess-board.css";
import { useState } from "react";
import { SQUARES } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useChessGame } from '../hooks/useChessGame';
import DraggablePiece from './DraggablePiece';
import DroppableSquare from './DroppableSquare';

const Board = () => {
  const { 
    board, 
    turn, 
    moveHistory, 
    movePiece, 
    undoMove,
    chess 
  } = useChessGame();

  const [selectedCell, setSelectedCell] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [promotionMove, setPromotionMove] = useState(null);

  const checkGameOver = () => {
    const gameOver = chess.isGameOver();
    if (gameOver) {
      const isCheckmate = chess.isCheckmate();
      const isStalemate = chess.isStalemate();
      const isDraw = chess.isDraw();
      const isThreefoldRepetition = chess.isThreefoldRepetition();
      const isFiftyMoves = chess.isDrawByFiftyMoves();
      const isInsufficientMaterial = chess.isInsufficientMaterial();
      if (isCheckmate) {
        const winner = chess.turn() === 'w' ? 'Black' : 'White';
        alert('Game over, ' + winner + ' wins');
      } else if (isStalemate) {
        alert('Game over, stalemate');
      } else if (isDraw) {
        alert('Game over, draw');
      } else if (isThreefoldRepetition) {
        alert('Game over, threefold repetition');
      } else if (isFiftyMoves) {
        alert('Game over, fifty moves');
      } else if (isInsufficientMaterial) {
        alert('Game over, insufficient material');
      }
    }
  }

  const handleMovePiece = (move) => {
    if (movePiece(move)) {
      checkGameOver();
    }
  };

  const removeHighlights = () => {
    removeSelected();
    const highlightedCells = document.querySelectorAll('.highlight');
    const promotionCells = document.querySelectorAll('.promotion');
    highlightedCells.forEach(cell => {
      cell.classList.remove('highlight');
    });

    promotionCells.forEach(cell => {
      cell.classList.remove('promotion');
    });
  }

  const removeSelected = () => {
    const selectedCells = document.querySelectorAll('.selected');
    selectedCells.forEach(cell => {
      cell.classList.remove('selected');
    });
    setSelectedCell(null);
    setLegalMoves([]);
  }

  const getSquareFromMove = (move) => {
    if (move.includes('O-O-O')) {
      return chess.turn() === 'w' ? 'c1' : 'c8';
    }
    if (move.includes('O-O')) {
      return chess.turn() === 'w' ? 'g1' : 'g8';
    }

    // Remove check/checkmate indicators
    let cleanMove = move.replace(/[+#]/g, '');
  
    if (cleanMove.includes('=')) {
      cleanMove = cleanMove.substring(0, cleanMove.indexOf('='));
    }
    
    const square = cleanMove.slice(-2);
    
    // Validate that it's a proper square (a1-h8)
    const validSquare = /^[a-h][1-8]$/.test(square);
    return validSquare ? square : null;
  }

  const highlightMoves = (square) => {
    removeHighlights();
    if(!square) return;

    const selectedCells = document.querySelectorAll('.selected');

    const currentCell = document.querySelector(`[data-square="${square}"]`);
    if(!currentCell?.classList.contains('selected')) {
      selectedCells.forEach(cell => {
        cell?.classList.remove('selected');
      });
      currentCell.classList.add('selected');
      setSelectedCell(currentCell);
    } else {
      currentCell.classList.remove('selected');
      setSelectedCell(null);
      return;
    }

    const moves = chess.moves({square});
    setLegalMoves(moves);
    
    moves.forEach(move => {
      const isCastle = move.includes('O-O');
      const isPromotion = move.includes('=');
      if (isPromotion) {
        const promotionSquare = getSquareFromMove(move);
        const cell = document.querySelector(`[data-square="${promotionSquare}"]`);
        cell?.classList.add('promotion');
      } else if (isCastle) {
        const isLongCastle = move.includes('O-O-O');
        const turn = chess.turn();
        let kingSquare = turn === 'w' ? 'g1' : 'g8';    
        if (isLongCastle) {
          kingSquare = turn === 'w' ? 'c1' : 'c8';
        }
        const kingCell = document.querySelector(`[data-square="${kingSquare}"]`);
        kingCell?.classList.add('highlight');
      } else {
        const justSquare = getSquareFromMove(move);
        const cell = document.querySelector(`[data-square="${justSquare}"]`);
        cell?.classList.add('highlight');
      }
    });
  };

  const isMovePromotion = (selectedCell, move) => {
    const piece = chess.get(selectedCell?.dataset.square);
    const isPawn = piece && piece.type === 'p';
    const isLastRank = (piece.color === 'w' && move[1] === '8') || 
                        (piece.color === 'b' && move[1] === '1');
    return isPawn && isLastRank;
  }

  const handleCellClick = (square) => {
    if(!square) return;
    
    // If we have a promotion in progress, ignore new clicks
    if (promotionMove) return;
    
    setLegalMoves([]);
    removeHighlights();

    
    if(selectedCell) {
      const targetSquare = chess.get(square);
      
      if (!targetSquare) {
        if (isMovePromotion(selectedCell, square)) {
          setPromotionMove({ from: selectedCell?.dataset.square, to: square });
        } else {
          setSelectedCell(null);
          handleMovePiece({ from: selectedCell?.dataset.square, to: square });
        }
      } else {
        if (targetSquare.color === chess.turn()) {
          return;
        } else {
          if (isMovePromotion(selectedCell, square)) {
            setPromotionMove({ from: selectedCell?.dataset.square, to: square });
          } else {
            handleMovePiece({ from: selectedCell?.dataset.square, to: square });
          }
        }
      }
    } else {
      highlightMoves(square);
    }
  };

  const handlePromotion = (pieceType) => {
    if (!pieceType || !promotionMove) {
      setPromotionMove(null);
      return;
    }

    handleMovePiece({
      ...promotionMove,
      promotion: pieceType
    });

    setPromotionMove(null);
  };

  const handleDrop = (fromSquare, toSquare) => {
    if (fromSquare === toSquare) return;
    
    const piece = chess.get(fromSquare);
    if (!piece) return;
    
    // Check for promotion
    if (piece.type === 'p') {
      const isLastRank = (piece.color === 'w' && toSquare[1] === '8') || 
                         (piece.color === 'b' && toSquare[1] === '1');
      if (isLastRank) {
        setPromotionMove({ from: fromSquare, to: toSquare });
        return;
      }
    }
    
    handleMovePiece({ 
      from: fromSquare, 
      to: toSquare 
    });
    
    setSelectedCell(null);
    removeHighlights();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="boardComponent">
        <div className="boardContainer">
          <div className="boardStyle">
            {
            board.map((row, rowIndex) => (
              <div key={rowIndex} className="rowStyle">
                {row.map((cell, cellIndex) => {
                  const index = rowIndex * 8 + cellIndex;
                  const square = SQUARES[index];
                  return (
                    <DroppableSquare 
                      key={cellIndex}
                      square={square}
                      onDrop={handleDrop}
                      onClick={handleCellClick}
                    >
                      {cell?.type && (
                        <DraggablePiece 
                          piece={{type: cell.type, color: cell.color}} 
                          square={square}
                          addHighlights={highlightMoves.bind(this, square)}
                          removeHighlights={removeHighlights.bind(this, square)}
                        />
                      )}
                    </DroppableSquare>
                  );
                })}
                <div className="coordinateLabel rankLabel">{8 - rowIndex}</div>
              </div>
            ))}
            <div className="rowStyle fileLabels">
              {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file, index) => (
                <div key={index} className="coordinateLabel fileLabel">{file}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="infoContainer">
          <p className="turn">Turn: {turn}</p>
          <p className="selectedCell">Selected: {selectedCell?.dataset.square}</p>
          <div className="legalMoves">
            <p>Legal Moves:</p>
            {legalMoves.map((move, index) => (
              <span key={index}>{move} </span>
            ))}
          </div>
          <div className="moveHistory">
            <p>Move History:</p>
            <div className="moveHistoryList">
              {moveHistory.map((move, index) => (
                <span className="move" key={index}>{move.from} {move.to} </span>
              ))}
            </div>
          </div>
          <button onClick={() => {
            undoMove();
          }}>Undo</button>
          
          {promotionMove && (
            <div className="promotionDialog">
              <p>Choose promotion piece:</p>
              <select 
                onChange={(e) => handlePromotion(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select a piece</option>
                <option value="q">Queen</option>
                <option value="r">Rook</option>
                <option value="b">Bishop</option>
                <option value="n">Knight</option>
              </select>
              <button onClick={() => handlePromotion(null)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export default Board;
