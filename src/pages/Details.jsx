import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Client, { BASE_URL } from "../services/api.js"

const Details = ({ user }) => {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)

  const [ratings, setRatings] = useState([])
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)

  const [success, setSuccess] = useState("")
  const [popupError, setPopupError] = useState("")

  useEffect(() => {
    fetchRecipe()
    fetchRatings()
    if (user) {
      checkFavoriteStatus()
    }
  }, [recipeId, user])

  const fetchRecipe = async () => {
    try {
      const res = await Client.get(`/recipe/${recipeId}`)
      setRecipe(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to load recipe details.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRatings = async () => {
    try {
      const res = await Client.get(`/rating/${recipeId}`)
      setRatings(res.data)
    } catch (err) {
      console.error("Error fetching ratings:", err)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const res = await Client.get(`/recipe/${recipeId}/favStatus`)
      setIsFavorited(res.data.isFavorited)
      setFavoritesCount(res.data.favoritesCount)
    } catch (err) {
      console.error("Error checking favorite status:", err)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      setPopupError("Please login to favorite recipes")
      setTimeout(() => setPopupError(""), 5000)
      return
    }

    try {
      const res = await Client.post(`/recipe/${recipeId}/toggleFav`)
      setIsFavorited(res.data.isFavorited)
      setFavoritesCount(res.data.favoritesCount)
    } catch (err) {
      console.error("Error toggling favorite:", err)
      setPopupError("Failed to update favorite status")
      setTimeout(() => setPopupError(""), 5000)
    }
  }

  const handleSubmitRating = async (e) => {
    e.preventDefault()

    if (!user) {
      setPopupError("Please login to rate recipes")
      setTimeout(() => setPopupError(""), 5000)
      return
    }

    setSubmittingRating(true)
    try {
      const response = await Client.post(`/rating/${recipeId}`, {
        rating: newRating,
        comment: newComment,
        userId: user.id,
      })

      setRatings([response.data, ...ratings])
      setNewRating(5)
      setNewComment("")
      setSuccess("Rating submitted successfully!")
      setTimeout(() => setSuccess(""), 5000)
      fetchRecipe()
    } catch (err) {
      console.error("Error submitting rating:", err)
      setPopupError("Failed to submit rating")
      setTimeout(() => setPopupError(""), 5000)
    } finally {
      setSubmittingRating(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await Client.delete(`/recipe/${recipeId}`)
        setSuccess("Recipe deleted successfully!")
        setTimeout(() => {
          setSuccess("")
          navigate("/recipe")
        }, 1000)
      } catch (err) {
        console.error(err)
        setPopupError("Failed to delete recipe")
        setTimeout(() => setPopupError(""), 5000)
      }
    }
  }

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0)
    return (total / ratings.length).toFixed(1)
  }

  const isOwner = user && recipe && recipe.user._id === user.id

  if (loading)
    return <div className="loading-message">Loading recipe details...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!recipe) return <div className="error-message">Recipe not found.</div>

  const averageRating = calculateAverageRating()

  return (
    <div className="recipe-details-container">
      {/* Success Popup */}
      {success && (
        <div className="popup popup-success">
          <div className="popup-content">
            <span className="popup-icon">✓</span>
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {popupError && (
        <div className="popup popup-error">
          <div className="popup-content">
            <span className="popup-icon">⚠</span>
            <span>{popupError}</span>
            <button onClick={() => setPopupError("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="details-header">
        <Link to="/recipe">
          <button className="back-button">← Back to Recipes</button>
        </Link>

        <div className="header-actions">
          {/* Favorite Button */}
          {user && !isOwner && (
            <button
              onClick={toggleFavorite}
              className={`favorite-button ${isFavorited ? "favorited" : ""}`}
            >
              {isFavorited ? "❤️" : "🤍"}{" "}
              {isFavorited ? "Favorited" : "Favorite"}
            </button>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="owner-actions">
              <Link to={`/recipe/edit/${recipeId}`}>
                <button className="edit-button">Edit Recipe</button>
              </Link>
              <button className="delete-button" onClick={handleDelete}>
                Delete Recipe
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="details-content">
        <h1>{recipe.title}</h1>

        <div className="recipe-meta">
          <div className="recipe-category-badge">{recipe.category}</div>

          {/* Owner Info */}
          {recipe.user && (
            <div className="recipe-owner-details">
              <img
                src={
                  recipe.user.image
                    ? `${BASE_URL}/${recipe.user.image}`
                    : "/default-avatar.png"
                }
                alt={recipe.user.username}
                className="owner-avatar-large"
              />
              <div>
                <p className="owner-label">Created by</p>
                <p className="owner-username">{recipe.user.username}</p>
              </div>
            </div>
          )}
        </div>

        <img
          src={`${BASE_URL}/${recipe.image}`}
          alt={recipe.title}
          className="recipe-details-image"
        />

        <div className="recipe-stats-details">
          <span>❤️ {favoritesCount} Favorites</span>
          <span>
            ⭐{" "}
            {averageRating > 0
              ? `${averageRating} (${ratings.length} ratings)`
              : "No ratings yet"}
          </span>
        </div>

        <section className="recipe-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </section>

        <section className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.split(/[\n,]+/).map((ing, idx) => (
              <li key={idx}>{ing.trim()}</li>
            ))}
          </ul>
        </section>

        <section className="recipe-section recipe-info-grid">
          <div className="info-item">
            <h3>⏱️ Prep Time</h3>
            <p>{recipe.preparingTime || "Not specified"}</p>
          </div>
          <div className="info-item">
            <h3>🔥 Cook Time</h3>
            <p>{recipe.cookingTime || "Not specified"}</p>
          </div>
          <div className="info-item">
            <h3>👥 Servings</h3>
            <p>{recipe.servings || "Not specified"}</p>
          </div>
        </section>

        {/* Ratings Section */}
        <section className="recipe-section ratings-section">
          <h2>Ratings & Reviews ({ratings.length})</h2>

          {/* Add Rating Form */}
          {user && !isOwner && (
            <form onSubmit={handleSubmitRating} className="rating-form">
              <h3>Leave a Rating</h3>
              <div className="rating-input">
                <label htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  required
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>
              </div>
              <div className="comment-input">
                <label htmlFor="comment">Comment (optional):</label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                  placeholder="Share your thoughts about this recipe..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingRating}
                className="submit-rating-btn"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </form>
          )}

          {!user && (
            <p className="login-prompt">Please login to leave a rating</p>
          )}

          {isOwner && (
            <p className="owner-notice">You cannot rate your own recipe</p>
          )}

          {/* Display Ratings */}
          <div className="ratings-list">
            {ratings.length === 0 ? (
              <p className="no-ratings">
                No ratings yet. Be the first to rate!
              </p>
            ) : (
              ratings.map((rating) => (
                <div key={rating._id} className="rating-item">
                  <div className="rating-header">
                    <div className="rating-stars">
                      {"⭐".repeat(rating.rating)}
                      <span className="rating-number">({rating.rating}/5)</span>
                    </div>
                    <span className="rating-date">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="rating-comment">{rating.comment}</p>
                  )}
                  {rating.userId?.username && (
                    <p className="rating-author">by {rating.userId.username}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Details
