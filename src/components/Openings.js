import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Openings = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            title
          }
          html
        }
      }
    }
  `)

  if (!data?.allMarkdownRemark?.nodes) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {data.allMarkdownRemark.nodes.map((node, index) => (
        <div key={index}>
          <h1>{node.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </div>
      ))}
    </div>
  )
}

export default Openings 