import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../services/api.js"
import RecipeCard from "../components/RecipeCard.jsx"

const MyRecipes = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await Client.get("/recipe/myRecipes")
        setRecipes(res.data)
      } catch (err) {
        setError("Failed to load your recipes.")
      } finally {
        setLoading(false)
      }
    }

    fetchMyRecipes()
  }, [])

  if (loading) return <div className="loading-message">Loading your recipes...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="my-recipes-container">
      <div className="my-recipes-header">
        <h1>My Recipes</h1>
        <button
          className="add-recipe-btn"
          onClick={() => navigate("/recipe/createRecipe")}>
          <span className="plus-icon">+</span> Add Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="no-recipes-state">
          <div className="no-recipes-icon">🍳</div>
          <h2>No Recipes Yet</h2>
          <p>You haven't added any recipes yet. Start creating your first recipe!</p>
          <button
            className="create-first-recipe-btn"
            onClick={() => navigate("/recipe/createRecipe")}>
            Create Your First Recipe
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRecipes
