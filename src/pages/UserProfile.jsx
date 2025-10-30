import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Client, { BASE_URL } from "../services/api"
import RecipeCard from "../components/RecipeCard"

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [favoritedRecipes, setFavoritedRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await Client.get(`/users/${userId}`)
        setUser(response.data.user)
        setFavoritedRecipes(response.data.favoritedRecipes || [])
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
      setLoading(false)
    }
    getUser()
  }, [userId])

  if (loading) {
    return <div className="loading-message">Loading profile...</div>
  }

  return user ? (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <img
            src={
              user.image ? `${BASE_URL}${user.image}` : "/default-avatar.png"
            }
            alt={`profile image for ${user.username}`}
            className="profile-image"
          />
          <div className="profile-details">
            <h2>{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-gender">
              {user.gender === "male" ? "Male" : "Female"}
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <Link to={`/users/${userId}/edit`}>
            <button className="edit-profile-btn">Edit Profile</button>
          </Link>
          <Link to={`/auth/update/${userId}}`}>
            <button className="update-password-btn">Update Password</button>
          </Link>
        </div>
      </div>

      <div className="favorited-section">
        <h3 className="section-title">
          ❤️ Favorited Recipes ({favoritedRecipes.length})
        </h3>
        {favoritedRecipes.length > 0 ? (
          <div className="recipe-grid">
            {favoritedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="no-favorites">
            <p>No favorited recipes yet.</p>
            <Link to="/recipe">
              <button className="browse-recipes-btn">Browse Recipes</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="error-message">Profile Data is not Showing....</div>
  )
}

export default UserProfile
