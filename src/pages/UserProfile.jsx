import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Client from "../services/api"

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [favoritedRecipes, setFavoritedRecipes] = useState([])

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
    }
    getUser()
  }, [userId])

  return user ? (
    <div>
      <img
        src={`http://localhost:3000${user.image}`}
        alt={`profile image for ${user.username}`}
        width="120"
        height="120"
      />
      <h4>Username: {user.username}</h4>
      <h4>Email: {user.email}</h4>

      <Link to={`/users/${userId}/edit`}>
        <button>Edit profile</button>
      </Link>
      <Link to={`/auth/update/${userId}`}>
        <button>Update password</button>
      </Link>

      <div>
        <h3>Favorited Recipes</h3>
        {favoritedRecipes.length > 0 ? (
          favoritedRecipes.map((recipe) => (
            <div key={recipe._id}>
              <h4>{recipe.title}</h4>
              <p>{recipe.description}</p>
            </div>
          ))
        ) : (
          <p>No favorited recipes yet.</p>
        )}
      </div>
    </div>
  ) : (
    <div>Profile Data is not Showing....</div>
  )
}

export default UserProfile
