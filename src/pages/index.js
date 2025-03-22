import * as React from "react"
import Board from "../components/chess-board.js"

const Page = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
    <h1>Quick Chess</h1>
    <Board />
  </div>
)

export default Page

export const Head = () => <title>quick-chess</title>