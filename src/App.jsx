import { useState, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router"
import { CheckSession } from "./services/Auth"

import Nav from "./components/Nav"
import Register from "./pages/SignUp"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Form from "./pages/Form"
import AllRecipes from "./pages/AllRecipes"
import Details from "./pages/Details"
import MyRecipes from "./pages/MyRecipes"
import Challenges from "./pages/Challenges"
import ForgotPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import UserProfile from "./pages/UserProfile"
import UserProfileEdit from "./pages/UserProfileEdit"
import "./App.css"


const App = () => {
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])

  const location = useLocation()

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

  const hideSidebarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/auth/reset",
  ]

  const shouldHideSidebar = hideSidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  )

  return (
    <>
      {!shouldHideSidebar && user && (
        <Nav user={user} handleLogOut={handleLogOut} />
      )}
      <main>
        <Routes>
          {/* auth routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset/:token" element={<ResetPassword />} />

          {/* user routes */}
          <Route
            path="/users/:userId"
            element={<UserProfile user={user} setUser={setUser} />}
          />
          <Route
            path="/users/:userId/edit"
            element={<UserProfileEdit user={user} setUser={setUser} />}
          />

          {/* recipe routes */}
          <Route path="/recipe" element={<AllRecipes />} />
          <Route
            path="/recipe/createRecipe"
            element={<Form recipes={recipes} setRecipes={setRecipes} />}
          />
          <Route
            path="/recipe/edit/:recipeId"
            element={<Form recipes={recipes} setRecipes={setRecipes} />}
          />
          <Route
            path="/recipe/:recipeId"
            element={<Details user={user} />}
          />
          <Route path="/recipe/myRecipes" element={<MyRecipes />} />

          {/* challenges routes */}
          <Route path="/recipe/createRecipe" element={<Form />} />
          <Route path="/challenges" element={<Challenges/>} />
        </Routes>
      </main>
    </>
  )
}

export default App
