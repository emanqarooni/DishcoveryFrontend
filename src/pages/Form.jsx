import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Client from "../services/api.js"

const Form = ({ recipes, setRecipes }) => {
  const { recipeId } = useParams() // Get recipeId from URL if editing
  const navigate = useNavigate()
  const isEditMode = !!recipeId // Check if we're in edit mode

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

  useEffect(() => {
    if (isEditMode) {
      fetchRecipe()
    }
  }, [recipeId])

  const fetchRecipe = async () => {
    try {
      setLoading(true)
      const response = await Client.get(`/recipe/${recipeId}`)
      const recipe = response.data

      setRecipeState({
        title: recipe.title || "",
        description: recipe.description || "",
        ingredients: recipe.ingredients || "",
        preparingTime: recipe.preparingTime || "",
        cookingTime: recipe.cookingTime || "",
        servings: recipe.servings || "",
        category: recipe.category || "",
      })
    } catch (error) {
      console.error("Error fetching recipe:", error)
      setError("Failed to load recipe")
    } finally {
      setLoading(false)
    }
  }

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

    try {
      if (isEditMode) {
        const response = await Client.put(`/recipe/${recipeId}`, recipeState)

        setSuccess("Recipe updated successfully!")

        setTimeout(() => {
          navigate(`/recipe/${recipeId}`)
        }, 1000)
      } else {
        const formData = new FormData()

        Object.entries(recipeState).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value)
          }
        })

        if (imageFile) {
          formData.append("image", imageFile)
        }

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

        const fileInput = document.getElementById("image")
        if (fileInput) fileInput.value = ""

        setSuccess("Recipe created successfully!")

        setTimeout(() => {
          setSuccess("")
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting recipe:", error)

      if (error.response) {
        setError(error.response.data.msg || "Error saving recipe")
      } else if (error.request) {
        setError("No response from server. Please check your connection.")
      } else {
        setError("Error saving recipe. Please try again.")
      }

      setTimeout(() => {
        setError("")
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode && !recipeState.title) {
    return <div className="loading-message">Loading recipe...</div>
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


      <form onSubmit={handleSubmit} className="recipeForm">
      <h1>{isEditMode ? "Edit Recipe" : "Create New Recipe"}</h1>
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

        {!isEditMode && (
          <>
            <label htmlFor="image">Upload Image</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </>
        )}

        {isEditMode && (
          <p className="edit-note">
            Note: Image cannot be changed when editing a recipe.
          </p>
        )}

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

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Recipe"
              : "Create Recipe"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(isEditMode ? `/recipe/${recipeId}` : "/recipe")
            }
            className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form
