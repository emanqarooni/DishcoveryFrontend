import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getMealById } from "../services/mealService"

const ExploreDetails = ({ user }) => {
  const { mealId } = useParams()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMealDetails()
  }, [mealId])

  const fetchMealDetails = async () => {
    try {
      const mealData = await getMealById(mealId)
      setMeal(mealData)
    } catch (err) {
      console.error("Error fetching meal details:", err)
      setError("Failed to load meal details.")
    } finally {
      setLoading(false)
    }
  }

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    try {
      if (!url) return null
      const videoUrl = new URL(url)
      return videoUrl.searchParams.get("v")
    } catch {
      return null
    }
  }

  // Format ingredients and measurements
  const getIngredientsList = () => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim())
      }
    }
    return ingredients
  }

  // Format instructions
  const formatInstructions = (instructions) => {
    if (!instructions) return ""
    return instructions.split('\r\n').filter(step => step.trim() !== '')
  }

  if (loading) {
    return (
      <div className="explore-container">
        <div className="explore-loading">Loading meal details...</div>
      </div>
    )
  }

  if (error && !meal) {
    return (
      <div className="explore-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!meal) {
    return (
      <div className="explore-container">
        <div className="error-message">Meal not found.</div>
      </div>
    )
  }

  const ingredients = getIngredientsList()
  const instructions = formatInstructions(meal.strInstructions)
  const videoId = getYoutubeId(meal.strYoutube)
  const category = meal.strCategory || "Uncategorized"
  const area = meal.strArea || "Unknown"

  return (
    <div>
      <div className="explore-details-container">
        <div className="explore-details-header">
          <Link to="/explore">
            <button className="explore-back-button">← Back to Explore</button>
          </Link>
        </div>

        <div className="explore-details-content">
          <h1>{meal.strMeal}</h1>

          <div className="explore-meta-info">
            <div className="explore-category-badge">{category}</div>
            {area && area !== "Unknown" && (
              <div className="explore-area-badge">{area} Cuisine</div>
            )}
          </div>

          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="explore-details-image"
          />

          <div className="explore-meta-info">
            <div className="explore-meta-item">
              <span className="explore-meta-label">Category</span>
              <span className="explore-meta-value">{category}</span>
            </div>
            {area && area !== "Unknown" && (
              <div className="explore-meta-item">
                <span className="explore-meta-label">Cuisine</span>
                <span className="explore-meta-value">{area}</span>
              </div>
            )}
            {meal.strTags && (
              <div className="explore-meta-item">
                <span className="explore-meta-label">Tags</span>
                <span className="explore-meta-value">{meal.strTags}</span>
              </div>
            )}
          </div>

          {meal.strInstructions && (
            <section className="explore-section">
              <h2>Instructions</h2>
              <div className="explore-instructions">
                {instructions.length > 0 ? (
                  <ol>
                    {instructions.map((step, index) => (
                      <li key={index} style={{ marginBottom: '15px' }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>{meal.strInstructions}</p>
                )}
              </div>
            </section>
          )}

          {ingredients.length > 0 && (
            <section className="explore-section">
              <h2>Ingredients</h2>
              <ul className="explore-ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </section>
          )}

          {videoId && (
            <section className="explore-section explore-video-container">
              <h2>Video Tutorial</h2>
              <iframe
                className="explore-video-frame"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${meal.strMeal} Tutorial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </section>
          )}

          {meal.strSource && (
            <section className="explore-section">
              <h2>Source</h2>
              <p>
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--warm-tan)', fontWeight: '600' }}
                >
                  View Original Recipe
                </a>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExploreDetails
