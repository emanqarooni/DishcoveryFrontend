import { useState, useEffect } from "react"
import Client, { BASE_URL } from "../services/api.js"
import RecipeCard from "../components/RecipeCard.jsx"

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    "All",
    "European",
    "Healthy",
    "Mexican",
    "Arabic",
    "American",
    "Indian",
    "African",
    "EastAsian",
    "Turkish",
  ]

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await Client.get("/recipe")
        setRecipes(response.data)
        setLoading(false)
      } catch (error) {
        setError("Failed to load recipes. Please try again.")
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <div className="all-recipes-container">
        <div className="loading-message">Loading recipes...</div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return <div className="no-recipes">No recipes available yet.</div>
  }

  return (
    <div className="all-recipes-container">
      <h1>All Recipes</h1>

      {/* Grid of recipe cards */}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default AllRecipes
