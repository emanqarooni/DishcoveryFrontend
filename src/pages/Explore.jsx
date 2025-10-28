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

  //fetch youtube vids
  const getYoutubeId = (url) => {
    try {
      if (!url) return null
      const videoUrl = new URL(url)
      return videoUrl.searchParams.get("v")
    } catch {
      return null
    }
  }

  //fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMeals()
        const cats = await getMealCategories()
        setMeals(data)
        setCategories(cats)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  //handle searching by meal name
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    try {
      const results = await searchMealByName(search)
      setMeals(results || [])
    } catch (err) {
      console.error(err)
    }
  }

  //handling filter category
  const handleCategoryChange = async (e) => {
    const category = e.target.value
    setSelectedCategory(category)

    if (!category) {
      // reset to all
      const data = await getAllMeals()
      setMeals(data)
      return
    }
    const data = await getMealsByCategory(category)
    setMeals(data || [])
  }

  return (
    <div>
      <h1>Explore Recipes</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Search</button>
      </form>

      {/* Category Filter */}
      <div>
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.idCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Meals grid */}
      <div>
        {meals?.map((meal) => {
          const videoId = getYoutubeId(meal.strYoutube)

          return (
            <Link key={meal.idMeal} to={`/explore/${meal.idMeal}`}>
              <div>
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <h2>{meal.strMeal}</h2>

                {videoId && (
                  <iframe
                    width="100%"
                    height="250"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={meal.strMeal}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Explore
