import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

const Nav = ({ user, handleLogOut }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleLogoutClick = () => {
    handleLogOut()
    navigate("/login")
  }

  // Auto-close sidebar after 3 seconds when opened
  useEffect(() => {
    if (isOpen) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set new timer to close after 3 seconds
      timerRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    }

    // Cleanup timer on unmount or when isOpen changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isOpen])

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
            <Link to={`/users/${user.id}`} className="sidebar-link">
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
