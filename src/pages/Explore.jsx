import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  getAllMeals,
  searchMealByName,
  getMealCategories,
  getMealsByCategory,
} from "../services/mealService"

const Explore = () => {
  const [meals, setMeals] = useState([])
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)

  const getYoutubeId = (url) => {
    try {
      if (!url) return null
      const videoUrl = new URL(url)
      return videoUrl.searchParams.get("v")
    } catch {
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getAllMeals()
        const cats = await getMealCategories()
        setMeals(data)
        setCategories(cats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    try {
      setLoading(true)
      const results = await searchMealByName(search)
      setMeals(results || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = async (e) => {
    const category = e.target.value
    setSelectedCategory(category)

    try {
      setLoading(true)
      if (!category) {
        const data = await getAllMeals()
        setMeals(data)
      } else {
        const data = await getMealsByCategory(category)
        setMeals(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="all-recipes-container">
        <div className="loading-message">Loading recipes...</div>
      </div>
    )
  }

  return (
    <div className="all-recipes-container">
      <div className="recipes-header">
        <h1>Explore Recipes</h1>
        <p className="recipes-count">{meals?.length || 0} recipes found</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search meals by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-button"
          style={{ minWidth: '200px' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.idCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Meals Grid */}
      {!meals || meals.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found matching your criteria.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {meals.map((meal) => {
            const videoId = getYoutubeId(meal.strYoutube)

            return (
              <Link
                key={meal.idMeal}
                to={`/explore/${meal.idMeal}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="recipeCard">
                  <div className="recipeImage">
                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                    <div className="recipeCategory">{meal.strCategory}</div>
                  </div>

                  <div className="recipeContent">
                    <h3 className="recipe-card-title">{meal.strMeal}</h3>
                    <p style={{ fontSize: '0.95rem', color: '#5a4a4e', marginTop: '10px' }}>
                      {meal.strArea} Cuisine
                    </p>
                  </div>

                  <div className="recipeFooter">
                    <div className="recipe-stats">
                      <span className="stat-item">
                        🌍 {meal.strArea}
                      </span>
                      {videoId && (
                        <span className="stat-item">
                          📺 Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Explore
