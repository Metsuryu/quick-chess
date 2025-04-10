import * as React from "react"
import { useDrag } from 'react-dnd'
import ChessPiece from './ChessPiece'

const DraggablePiece = ({ piece, square, addHighlights, removeHighlights }) => {
  let highlight = false;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHESS_PIECE',
    item: () => {
      if (!highlight) {
        addHighlights(square);
        highlight = true;
      }
      return { piece, square };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      removeHighlights();
      highlight = false;
    }
  }));

  return (
    <div
      ref={drag.bind(this)}
      style={{
        opacity: isDragging ? 0.2 : 1
      }}
    >
      <ChessPiece piece={piece} />
    </div>
  )
}

export default DraggablePiece 