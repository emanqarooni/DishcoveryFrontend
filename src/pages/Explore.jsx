import { useEffect, useState } from "react"
import { getRandomMeal, getMealCategories } from "../services/mealService"

const Explore = () => {
  const [meal, setMeal] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const random = await getRandomMeal()
        setMeal(random)

        const cats = await getMealCategories()
        setCategories(cats)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <h1>Explore Recipes</h1>

      {meal && (
        <div>
          <h2>{meal.strMeal}</h2>
          <img src={meal.strMealThumb} alt={meal.strMeal} />
        </div>
      )}

      <h3>Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.idCategory}>{cat.strCategory}</li>
        ))}
      </ul>
    </>
  )
}

export default Explore
