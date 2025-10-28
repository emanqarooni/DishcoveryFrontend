import { useState, useEffect } from "react"
import Client from "../services/api.js"
import RecipeCard from "../components/RecipeCard.jsx"

const MyRecipes = ({ user }) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchMyRecipes()
    }
  }, [user])

  const fetchMyRecipes = async () => {
    try {
      // Get all recipes and filter by current user
      const res = await Client.get("/recipe")
      const myRecipes = res.data.filter(recipe => recipe.user._id === user.id)
      setRecipes(myRecipes)
    } catch (err) {
      console.error("Error fetching recipes:", err)
      setError("Failed to load your recipes.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="my-recipes-container">
        <div className="error-message">Please login to view your recipes</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="my-recipes-container">
        <div className="loading-message">Loading your recipes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-recipes-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="my-recipes-container">
        <h1>My Recipes</h1>
        <div className="no-recipes">You haven't added any recipes yet.</div>
      </div>
    )
  }

  return (
    <div className="my-recipes-container">
      <h1>My Recipes</h1>
      <p className="recipes-count">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default MyRecipes
