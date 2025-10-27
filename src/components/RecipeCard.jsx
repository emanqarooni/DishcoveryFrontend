import { useNavigate } from "react-router"
import Client, { BASE_URL } from "../services/api.js"

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id}`)
  }

  return (
    <div className="recipeCard" onClick={handleCardClick}>
      <div className="recipeImage">
        <img src={`${BASE_URL}/${recipe.image}`} alt={`${recipe.title}`} />
        <div className="recipeCategory">{recipe.category}</div>
      </div>

      <div className="recipeContent">
        <h3 className="recipe-card-title">{recipe.title}</h3>
      </div>

      <div className="recipeFooter">
        <div className="recipe-stats">
          <span className="stat-item">
            ❤️ {recipe.favouritedByUsers?.length || 0}
          </span>
          <span className="stat-item">
            ⭐ {recipe.ratings?.length || 0} ratings
          </span>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
