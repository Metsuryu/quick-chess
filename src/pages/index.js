import * as React from "react"
import { Link } from "gatsby"
import Board from "../components/chess-board"
import { ChessProvider } from "../context/ChessContext"

const IndexPage = () => (
  <ChessProvider>
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <h1>Quick Chess</h1>
      <Board />
      <Link to="/about" style={{ marginTop: "20px", color: "white" }}>About</Link>
    </main>
  </ChessProvider>
)

export default IndexPage

export const Head = () => <title>quick-chess</title>