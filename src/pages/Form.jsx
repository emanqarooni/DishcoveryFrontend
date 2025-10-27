const { useState } = require("react")

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
    setRecipeState({ ...recipeState, [event.target.name]: event.target.value })
  }

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0])
    const { id } = event.target
    setRecipeState({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    const token = localStorage.getItem("token")

    Object.entries(postState).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Append file
    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      const response = await axios.post(
        " http://localhost:3000/recipe/createRecipe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          Authorization: `Bearer ${token}`,
        }
      )

      let recipeList = [...recipes]
      recipeList.push(response.data)
      setRecipeState(recipeList)
      set(initialState)
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
      />
      <label htmlFor="description">Description</label>
      <input
        type="textarea"
        name="description"
        onChange={handleChange}
        value={recipeState.description}
      />
      <label htmlFor="ingredients">Ingredients</label>
      <input
        id="ingredients"
        type="textarea"
        name="ingredients"
        onChange={handleChange}
        value={recipeState.ingredients}
      />
      <label htmlFor="image">Upload image</label>
      <input
        id="image"
        type="file"
        name="image"
        onChange={handleChange}
        value={recipeState.image}
      />
      <label htmlFor="preparingTime">Preparing Time</label>
      <input
        id="preparingTime"
        type="text"
        name="preparingTime"
        onChange={handleChange}
        value={recipeState.preparingTime}
      />
      <label htmlFor="cookingTime">Cooking Time</label>
      <input
        id="cookingTime"
        type="text"
        name="cookingTime"
        onChange={handleChange}
        value={recipeState.cookingTime}
      />
      <label htmlFor="servings">Servings</label>
      <input
        id="servings"
        type="number"
        name="servings"
        onChange={handleChange}
        value={recipeState.servings}
      />
      <label htmlFor="category">Category</label>
      <input
        id="category"
        type="text"
        name="category"
        onChange={handleChange}
        value={recipeState.category}
      />
    </form>
  )
}

export default Form
