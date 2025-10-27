import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Client, {BASE_URL} from "../services/api.js"

const Details = () => {
  const { recipeId } = useParams() // grab ID from route
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await Client.get(`/recipe/${recipeId}`)
        setRecipe(res.data)
      } catch (err) {
        console.error(err)
        setError("Failed to load recipe details.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  if (loading) return <div>Loading recipe details...</div>
  if (error) return <div>{error}</div>
  if (!recipe) return <div>Recipe not found.</div>

  return (
    <div className="recipe-details-container">
      <Link to="/recipe">
        <button>Back to Recipes</button>
      </Link>

      <h1>{recipe.title}</h1>
      <img
        src={`${BASE_URL}/${recipe.image}`}
        alt={recipe.title}
        style={{ maxWidth: "500px", width: "100%" }}
      />
      <p>
        <strong>Description:</strong> {recipe.description}
      </p>
      <p>
        <strong>Ingredients:</strong>
      </p>
      <ul>
        {recipe.ingredients.split(/[\n,]+/).map((ing, idx) => (
          <li key={idx}>{ing.trim()}</li>
        ))}
      </ul>
      <p>
        <strong>Preparing Time:</strong> {recipe.preparingTime || "-"}
      </p>
      <p>
        <strong>Cooking Time:</strong> {recipe.cookingTime || "-"}
      </p>
      <p>
        <strong>Servings:</strong> {recipe.servings || "-"}
      </p>
      <p>
        <strong>Category:</strong> {recipe.category}
      </p>
    </div>
  )
}

export default Details
