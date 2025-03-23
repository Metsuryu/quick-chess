import * as React from "react"
import { Link } from "gatsby"
import OpeningsPage from "./openings"
const AboutPage = () => (
  <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white"}}>
    <h1>About</h1>
    <p>A very simple chess game using chess.js, built with React and Gatsby. I might add more features later.</p>
    <h1>Openings</h1>
    <OpeningsPage />

    <Link to="/" style={{ marginTop: "20px", color: "white" }}>Back to game</Link>
  </main>
)

export default AboutPage 