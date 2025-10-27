import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"

import Challenges from "./pages/Challenges"

const App = () => {
  return (
  <Routes>
    <Route path="/challenges" element={<Challenges/>}/>
  </Routes>
  )
}

export default App
