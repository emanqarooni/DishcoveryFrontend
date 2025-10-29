import { useState, useEffect } from "react"
import Client from "../services/api.js"
import RecipeCard from "../components/RecipeCard.jsx"

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

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
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await Client.get("/recipe")
      // Backend now handles sorting by _id: -1 (newest first)
      setRecipes(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setError("Failed to load recipes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory

    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower) ||
      recipe.category.toLowerCase().includes(searchLower) ||
      recipe.ingredients.toLowerCase().includes(searchLower) ||
      (recipe.user?.username &&
        recipe.user.username.toLowerCase().includes(searchLower))

    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="all-recipes-container">
        <div className="loading-message">Loading recipes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="all-recipes-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchRecipes} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="all-recipes-container">
      <div className="recipes-header">
        <h1>All Recipes</h1>
        <p className="recipes-count">{filteredRecipes.length} recipes found</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by recipe name, description, category, username, or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found matching your criteria.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllRecipes
