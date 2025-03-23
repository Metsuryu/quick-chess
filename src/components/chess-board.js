import * as React from "react"
import "./chess-board.css"
import { useState } from "react"
import { Chess, SQUARES } from 'chess.js'
import wrImage from '../images/wr.png';
import wkImage from '../images/wk.png';
import wqImage from '../images/wq.png';
import wpImage from '../images/wp.png';
import wbImage from '../images/wb.png';
import wnImage from '../images/wn.png';
import brImage from '../images/br.png';
import bnImage from '../images/bn.png';
import bbImage from '../images/bb.png';
import bqImage from '../images/bq.png';
import bkImage from '../images/bk.png';
import bpImage from '../images/bp.png';

const chess = new Chess();
const startingBoard = chess.board();
const pieceImages = {
  'wp': wpImage,
  'wr': wrImage,
  'wn': wnImage,
  'wb': wbImage,
  'wq': wqImage,
  'wk': wkImage,
  'bp': bpImage,
  'br': brImage,
  'bn': bnImage,
  'bb': bbImage,
  'bq': bqImage,
  'bk': bkImage,
};

const Board = () => {
  const [board, setBoard] = useState(startingBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [turn, setTurn] = useState('w');


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

  const movePiece = (move) => {
    console.log('move', move);
    console.log('moveHistory', moveHistory);

    try {
      chess.move(move);
      setBoard(chess.board());
      setMoveHistory([...moveHistory, move]);
      setTurn(chess.turn());
      checkGameOver();
    } catch (err) {
      console.log('err', err);
      setLegalMoves([]);
      removeHighlights();
      removeSelected();
    }
  };

  const undoMove = () => {
    chess.undo();
    setBoard(chess.board());
    setMoveHistory(moveHistory.slice(0, -1));
    setTurn(chess.turn());
  };

  const removeHighlights = () => {
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
    removeHighlights();
    const selectedCells = document.querySelectorAll('.selected');
    selectedCells.forEach(cell => {
      cell.classList.remove('selected');
    });
    setSelectedCell(null);
    setLegalMoves([]);
  }

  const getSquareFromMove = (move) => {
    // Handle castling
    if (move.includes('O-O-O')) {
      return chess.turn() === 'w' ? 'c1' : 'c8'; // queenside castling
    }
    if (move.includes('O-O')) {
      return chess.turn() === 'w' ? 'g1' : 'g8'; // kingside castling
    }

    // Remove check/checkmate indicators
    let cleanMove = move.replace(/[+#]/g, '');
    
    // Handle promotion
    if (cleanMove.includes('=')) {
      cleanMove = cleanMove.substring(0, cleanMove.indexOf('='));
    }
    
    // Extract the destination square - always the last two characters after removing check/checkmate/promotion
    const square = cleanMove.slice(-2);
    
    // Validate that it's a proper square (a1-h8)
    const validSquare = /^[a-h][1-8]$/.test(square);
    return validSquare ? square : null;
  }

  const highlightMoves = (square) => {
    removeHighlights();

    const selectedCells = document.querySelectorAll('.selected');

    const currentCell = document.querySelector(`[data-square="${square}"]`);
    if(!currentCell.classList.contains('selected')) {
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
    console.log('moves', moves);
    
    moves.forEach(move => {
      const isCastle = move.includes('O-O');
      const isPromotion = move.includes('=');
      if (isPromotion) {
        const promotionSquare = getSquareFromMove(move);
        console.log('promotionSquare', promotionSquare);
        const cell = document.querySelector(`[data-square="${promotionSquare}"]`);
        cell?.classList.add('promotion');
      } else if (isCastle) {
        console.log('isCastle', isCastle);
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
        console.log('justSquare', justSquare);
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
    console.log('isPawn', isPawn);
    console.log('isLastRank', isLastRank);
    return isPawn && isLastRank;
  }

  const handleCellClick = (square) => {
    if(!square) return;
    setLegalMoves([]);
    removeHighlights();
    removeSelected();
    console.log('square', square);
    
    if(selectedCell) {
      const targetSquare = chess.get(square);
      console.log('targetSquare', targetSquare);
      
      if (!targetSquare) {
        console.log('Moving piece', selectedCell?.dataset.square, 'to', square);
        
        if (isMovePromotion(selectedCell, square)) {
          console.log('isPawn and isLastRank');
          movePiece({ from: selectedCell?.dataset.square, to: square, promotion: 'q' });
        } else {
          setSelectedCell(null);
          movePiece({ from: selectedCell?.dataset.square, to: square });
        }
      } else {
        if (targetSquare.color === chess.turn()) {
          return;
        } else {
          if (isMovePromotion(selectedCell, square)) {
            console.log('isPawn and isLastRank');
            movePiece({ from: selectedCell?.dataset.square, to: square, promotion: 'q' });
          } else {
            movePiece({ from: selectedCell?.dataset.square, to: square });
          }
        }
      }
    } else {
      highlightMoves(square);
    }
  };

  const showPieceImage = (piece) => {
    const key = `${piece.color}${piece.type}`;
    return <img src={pieceImages[key]} alt={key} />
  }

  return (
    <div className="boardComponent">
      <div className="boardContainer">
        <div className="boardStyle">
          {
          board.map((row, rowIndex) => (
            <div key={rowIndex} className="rowStyle">
              {row.map((cell, cellIndex) => {
                const index = rowIndex * 8 + cellIndex;
                return (
                  <div 
                    key={cellIndex} 
                    data-square={SQUARES[index]} 
                    className="cellStyle" 
                    onClick={() => {
                      handleCellClick(SQUARES[index]);
                    }}
                  >
                    {cell?.type && showPieceImage({type: cell.type, color: cell.color})}
                  </div>
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
      </div>
    </div>
  )
}

export default Board;
