import { useNavigate } from "react-router"
import { BASE_URL } from "../services/api.js"

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id}`)
  }

  const calculateAverageRating = () => {
    if (!recipe.ratings || recipe.ratings.length === 0) return 0
    const total = recipe.ratings.reduce(
      (sum, rating) => sum + (rating.rating || 0),
      0
    )
    return (total / recipe.ratings.length).toFixed(1)
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="recipeCard" onClick={handleCardClick}>
      <div className="recipeImage">
        <img src={`${BASE_URL}/${recipe.image}`} alt={recipe.title} />
        <div className="recipeCategory">{recipe.category}</div>
      </div>

      <div className="recipeContent">
        <h3 className="recipe-card-title">{recipe.title}</h3>

        {/* Owner Info */}
        {recipe.user && (
          <div className="recipe-owner">
            <img
              src={
                recipe.user.image
                  ? `${BASE_URL}/${recipe.user.image}`
                  : "/default-avatar.png"
              }
              alt={recipe.user.username}
              className="owner-avatar"
            />
            <span className="owner-name">by {recipe.user.username}</span>
          </div>
        )}
      </div>

      <div className="recipeFooter">
        <div className="recipe-stats">
          <span className="stat-item">
            ❤️ {recipe.favouritedByUsers?.length || 0}
          </span>
          <span className="stat-item">
            ⭐{" "}
            {averageRating > 0
              ? `${averageRating} (${recipe.ratings?.length || 0})`
              : "No ratings"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
