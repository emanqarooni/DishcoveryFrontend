import { useState } from "react"
import Client, { BASE_URL } from "../services/api.js"

const Form = ({ recipes, setRecipes }) => {
  const initialState = {
    title: "",
    description: "",
    ingredients: "",
    preparingTime: "",
    cookingTime: "",
    servings: "",
    category: "",
    favouritedByUsers: "",
    ratings: "",
  }

  const [recipeState, setRecipeState] = useState(initialState)
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (event) => {
    // const { id } = event.target
    setRecipeState({ ...recipeState, [event.target.name]: event.target.value })
  }

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    const token = localStorage.getItem("token")

    Object.entries(recipeState).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Append file
    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      const response = await Client.post(`${BASE_URL}/recipe/createRecipe`)
      formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }

      // Update recipes list with the new recipe
      const recipeList = [...recipes, response.data]
      setRecipes(recipeList)

      // Reset form
      setRecipeState(initialState)
      setImageFile(null)
    } catch (error) {
      console.error("Error creating recipe:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Create Recipe</button>
    </form>
  )
}

export default Form
