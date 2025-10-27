import { useState, useEffect } from "react"
import { Route, Routes } from "react-router"
import { CheckSession } from "./services/Auth"

// import Nav from "./components/Nav"
import SignUp from "./pages/SignUp"
// import Login from "./pages/Login"
import Home from "./pages/Home"
import Challenges from "./pages/Challenges"

import "./App.css"


const App = () => {
  const [user, setUser] = useState(null)

  const checkToken = async () => {
    try {
      const userData = await CheckSession()
      setUser(userData)
    } catch (error) {
      console.error("Session check failed:", error)
    }
  }

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) checkToken()
  }, [])

  return (
    <>
      {/* <Nav user={user} handleLogOut={handleLogOut} /> */}
      <main>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/signin" element={<Login setUser={setUser} />} /> */}
          <Route path="/register" element={<SignUp />} />
          <Route path="/challenges" element={<Challenges/>} />
        </Routes>
      </main>
    </>
  )
}

export default App
