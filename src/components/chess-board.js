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
console.log(startingBoard);
console.log(SQUARES);

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

  const movePiece = (move) => {
    console.log('move', move);
    
    try {
      chess.move(move);
      setBoard(chess.board());
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
  };

  const removeHighlights = () => {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => {
      cell.classList.remove('highlight');
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

  const highlightMoves = (square) => {
    removeHighlights();

    const selectedCells = document.querySelectorAll('.selected');

    // Select current cell if unselected
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

    // Get all possible moves for the piece on the given square
    const moves = chess.moves({square});
    setLegalMoves(moves);
    console.log('moves', moves);
    
    moves.forEach(move => {
      const isCastle = move.includes('O-O');
      if (isCastle) {
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
        const withoutPlus = move.includes('+') ? move.slice(0, move.length - 1) : move;
        const justSquare = withoutPlus.slice(withoutPlus.length - 2);
        const cell = document.querySelector(`[data-square="${justSquare}"]`);
        cell?.classList.add('highlight');
      }
    });
  };

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
        setSelectedCell(null);
        movePiece({ from: selectedCell?.dataset.square, to: square });
      } else {
        if (targetSquare.color === chess.turn()) {
          setLegalMoves([]);
          removeHighlights();
          removeSelected();
        } else {
          setLegalMoves([]);
          removeHighlights();
          removeSelected();
          movePiece({ from: selectedCell?.dataset.square, to: square });
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
        
        <button onClick={() => {
          movePiece('e4');
        }}>Move</button>
        <button onClick={() => {
          undoMove();
        }}>Undo</button>
      </div>
      <div className="infoContainer">
        <p className="selectedCell">Selected: {selectedCell?.dataset.square}</p>
        <div className="legalMoves">
          <p>Legal Moves:</p>
          {legalMoves.map((move, index) => (
            <span key={index}>{move} </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board;
