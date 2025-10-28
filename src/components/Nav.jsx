import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Nav = ({ user, handleLogOut }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleLogoutClick = () => {
    handleLogOut()
    navigate("/login")
  }

  return (
    <>
      {/* Toggle Button */}
      <button onClick={toggleSidebar} className="sidebar-toggle">
        {isOpen ? "x" : "-"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Menu</h2>

        <Link to="/recipe" className="sidebar-link" onClick={toggleSidebar}>
          All Recipes
        </Link>

        <Link
          to="/recipe/myRecipes"
          className="sidebar-link"
          onClick={toggleSidebar}
        >
          My Recipes
        </Link>

        <Link to="/challenges" className="sidebar-link" onClick={toggleSidebar}>
          Challenges
        </Link>

        <Link to="/explore" className="sidebar-link" onClick={toggleSidebar}>
          Explore
        </Link>

        {user && (
          <Link
            to={`/users/${user._id}`}
            className="sidebar-link"
            onClick={toggleSidebar}
          >
            Profile
          </Link>
        )}

        <button onClick={handleLogoutClick} className="logout-btn">
          Logout
        </button>
      </div>
    </>
  )
}

export default Nav
