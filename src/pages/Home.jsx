import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const Home = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className="home-container">
      <div className={`hero-section ${visible ? "fade-in" : ""}`}>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Dishcovery</h1>
          <p className="hero-subtitle">
            Discover, Create, and Share Your Favorite Recipes
          </p>
          <p className="hero-description">
            Join our community of food lovers and explore thousands of delicious
            recipes from around the world. Share your culinary creations and
            connect with fellow cooking enthusiasts.
          </p>
          <div className="hero-buttons">
            <Link to="/recipe">
              <button className="btn-primary">Explore Recipes</button>
            </Link>
            <Link to="/register">
              <button className="btn-secondary">Get Started</button>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <span className="emoji">🍕</span>
            <p>Italian</p>
          </div>
          <div className="floating-card card-2">
            <span className="emoji">🍜</span>
            <p>Asian</p>
          </div>
          <div className="floating-card card-3">
            <span className="emoji">🌮</span>
            <p>Mexican</p>
          </div>
          <div className="floating-card card-4">
            <span className="emoji">🥗</span>
            <p>Healthy</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Why Choose Recipe Haven?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Discover</h3>
            <p>
              Browse through thousands of recipes from various cuisines and
              find your next favorite dish
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create</h3>
            <p>
              Share your own recipes with the world and build your personal
              recipe collection
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Save</h3>
            <p>
              Favorite recipes you love and access them anytime from your
              personal profile
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate</h3>
            <p>
              Share your thoughts and help others discover the best recipes
              through ratings and reviews
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Compete</h3>
            <p>
              Join monthly challenges and showcase your culinary skills to win
              and get recognized
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Connect</h3>
            <p>
              Follow other food enthusiasts and get inspired by their amazing
              creations
            </p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start Your Culinary Journey?</h2>
        <p>Join thousands of food lovers sharing their passion for cooking</p>
        <Link to="/register">
          <button className="btn-cta">Sign Up Now</button>
        </Link>
      </div>
    </div>
  )
}

export default Home
