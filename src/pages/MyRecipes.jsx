import { useState, useEffect } from "react"
import Client from "../services/api.js"
import RecipeCard from "../components/RecipeCard.jsx"

const MyRecipes = () => {
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

  if (loading) return <div>Loading your recipes...</div>
  if (error) return <div>{error}</div>
  if (recipes.length === 0) return <div>You haven’t added any recipes yet.</div>

  return (
    <div className="my-recipes-container">
      <h1>My Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default MyRecipes
