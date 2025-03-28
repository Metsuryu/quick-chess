import * as React from "react"
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

const ChessPiece = ({ piece }) => {
  const data = useStaticQuery(graphql`
    {
      allFile(filter: {extension: {eq: "png"}}) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 50, height: 50, placeholder: NONE, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `);

  const key = `${piece.color}${piece.type}`;
  const image = data?.allFile?.nodes.find(node => node.relativePath === `${key}.png`);

  return <GatsbyImage image={image?.childImageSharp?.gatsbyImageData} alt={key} />;
}

export default ChessPiece; 