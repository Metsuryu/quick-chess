import * as React from "react"
import { graphql } from "gatsby"

const OpeningsPage = ({ data }) => (
  <div>
    <h1>{data?.markdownRemark?.frontmatter?.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: data?.markdownRemark?.html }} />
  </div>
)

export const query = graphql`
  query {
    markdownRemark(frontmatter: {title: {eq: "Chess Openings"}}) {
      frontmatter {
        title
      }
      html
    }
  }
`

export default OpeningsPage;