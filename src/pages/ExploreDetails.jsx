import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMealById } from "../services/mealService"

const ExploreDetails = () => {
  const { mealId } = useParams()
  const [meal, setMeal] = useState(null)

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
    const fetchMeal = async () => {
      const data = await getMealById(mealId)
      setMeal(data)
    }
    fetchMeal()
  }, [mealId])

  if (!meal) return <p>Loading...</p>

  const videoId = getYoutubeId(meal.strYoutube)

  //putting measure beside each ingredient
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure}`)
    }
  }

  return (
    <div>
      <h1>{meal.strMeal}</h1>
      <img src={meal.strMealThumb} alt={meal.strMeal} width="300" />

      <p>Category: {meal.strCategory}</p>
      <p>Area: {meal.strArea}</p>

      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p>{meal.strInstructions}</p>

      {videoId && (
        <>
          <h2>Video</h2>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={meal.strMeal}
            allowFullScreen
          ></iframe>
        </>
      )}
    </div>
  )
}

export default ExploreDetails
