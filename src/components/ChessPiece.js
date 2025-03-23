import * as React from "react"
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

const ChessPiece = ({ piece }) => {
  const key = `${piece.color}${piece.type}`;
  return <img src={pieceImages[key]} alt={key} />
}

export default ChessPiece; 