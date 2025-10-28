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
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? "✖" : "☰"}
          </button>
          {isOpen && <h2 className="sidebar-logo">Discovery</h2>}
        </div>

        {user && (
          <div className="user-info">
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt="User avatar"
              className="user-avatar"
            />
            {isOpen && (
              <div>
                <p className="username">{user.username}</p>
                <p className="email">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="sidebar-menu">
          <Link to="/recipe" className="sidebar-link">
            🍽️ {isOpen && <span>All Recipes</span>}
          </Link>
          <Link to="/recipe/myRecipes" className="sidebar-link">
            👨‍🍳 {isOpen && <span>My Recipes</span>}
          </Link>
          <Link to="/challenges" className="sidebar-link">
            🏆 {isOpen && <span>Challenges</span>}
          </Link>
          <Link to="/explore" className="sidebar-link">
            🔍 {isOpen && <span>Explore</span>}
          </Link>
          {user && (
            <Link to={`/users/${user._id}`} className="sidebar-link">
              👤 {isOpen && <span>User Profile</span>}
            </Link>
          )}
          <button
            onClick={handleLogoutClick}
            className="sidebar-link logout-btn"
          >
            🚪 {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default Nav
