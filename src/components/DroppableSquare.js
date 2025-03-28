import * as React from 'react';
import { useDrop } from 'react-dnd';

const DroppableSquare = ({ 
  square, 
  children, 
  onDrop, 
  onClick, 
  isHighlighted, 
  isSelected, 
  isPromotion }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CHESS_PIECE',
    drop: (item) => {
      onDrop(item.square, square);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      data-square={square}
      className={
        `cellStyle
        ${isOver ? 'drop-hover' : ''}
        ${isHighlighted ? 'highlight' : ''}
        ${isSelected ? 'selected' : ''}
        ${isPromotion ? 'promotion' : ''}`}
      onClick={() => onClick(square)}
    >
      {children}
    </div>
  )
}

export default DroppableSquare 