import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllMeals, searchMealByName } from "../services/mealService"

const Explore = () => {
  const [meals, setMeals] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false) //loading text if there is delay

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
      setLoading(true)
      try {
        const data = await getAllMeals()
        setMeals(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  //handle searching by meal name
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return

    setLoading(true)
    try {
      const results = await searchMealByName(search)
      setMeals(results || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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

      {loading && <p>Loading meals...</p>}

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
