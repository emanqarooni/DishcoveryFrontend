import { useState } from "react"
import Client from "../services/api.js"
import { Link } from "react-router-dom"

const Form = ({ recipes, setRecipes }) => {
  const initialState = {
    title: "",
    description: "",
    ingredients: "",
    preparingTime: "",
    cookingTime: "",
    servings: "",
    category: "",
  }

  const [recipeState, setRecipeState] = useState(initialState)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setRecipeState({ ...recipeState, [event.target.name]: event.target.value })
  }

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()

    Object.entries(recipeState).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value)
      }
    })

    // Append file
    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      const response = await Client.post(`/recipe/createRecipe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      let recipesList = [...recipes]
      recipesList.push(response.data)

      setRecipes(recipesList)

      setRecipeState(initialState)
      setImageFile(null)

      // Reset file input
      const fileInput = document.getElementById("image")
      if (fileInput) fileInput.value = ""

      // Show success message
      setSuccess("Recipe created successfully!")

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess("")
      }, 5000)
    } catch (error) {
      console.error("Error creating recipe:", error)

      // Show error message
      if (error.response) {
        setError(error.response.data.msg || "Error creating recipe")
      } else if (error.request) {
        setError("No response from server. Please check your connection.")
      } else {
        setError("Error creating recipe. Please try again.")
      }

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError("")
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Success Popup */}
      {success && (
        <div className="popup popup-success">
          <div className="popup-content">
            <span className="popup-icon">✓</span>
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {error && (
        <div className="popup popup-error">
          <div className="popup-content">
            <span className="popup-icon">⚠</span>
            <span>{error}</span>
            <button onClick={() => setError("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      <Link to="/recipe">
        <button type="button">Go to Recipes</button>
      </Link>

      <form onSubmit={handleSubmit} className="recipeForm">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          onChange={handleChange}
          value={recipeState.title}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={recipeState.description}
          required
        />

        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          onChange={handleChange}
          value={recipeState.ingredients}
          placeholder="Separate ingredients with commas or line breaks"
          required
        />

        <label htmlFor="image">Upload Image</label>
        <input
          id="image"
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          required
        />

        <label htmlFor="preparingTime">Preparing Time</label>
        <input
          id="preparingTime"
          type="text"
          name="preparingTime"
          onChange={handleChange}
          value={recipeState.preparingTime}
          placeholder="e.g., 15 minutes"
        />

        <label htmlFor="cookingTime">Cooking Time</label>
        <input
          id="cookingTime"
          type="text"
          name="cookingTime"
          onChange={handleChange}
          value={recipeState.cookingTime}
          placeholder="e.g., 30 minutes"
        />

        <label htmlFor="servings">Servings</label>
        <input
          id="servings"
          type="number"
          name="servings"
          onChange={handleChange}
          value={recipeState.servings}
          min="1"
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          onChange={handleChange}
          value={recipeState.category}
          required
        >
          <option value="">Select a category</option>
          <option value="European">European</option>
          <option value="Healthy">Healthy</option>
          <option value="Mexican">Mexican</option>
          <option value="Arabic">Arabic</option>
          <option value="American">American</option>
          <option value="Indian">Indian</option>
          <option value="African">African</option>
          <option value="EastAsian">East Asian</option>
          <option value="Turkish">Turkish</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  )
}

export default Form
