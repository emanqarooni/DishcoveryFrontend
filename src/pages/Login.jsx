import { useState } from "react"
import { SignInUser } from "../services/Auth"
import { useNavigate, Link } from "react-router-dom"
import "../Auth.css"

const Login = ({ setUser }) => {
  const navigate = useNavigate()

  const initialState = { email: "", password: "" }

  const [formValues, setFormValues] = useState(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const userData = await SignInUser(formValues)
      setFormValues(initialState)
      setUser(userData)

      setSuccess("Login successful! Redirecting...")

      setTimeout(() => {
        navigate(`/recipe`)
      }, 1500)
    } catch (err) {
      console.error("Login error:", err)
      setError(
        err.response?.data?.error ||
          "Invalid email or password. Please try again."
      )
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              onChange={handleChange}
              value={formValues.email}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                onChange={handleChange}
                value={formValues.password}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">{success}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={!formValues.email || !formValues.password}
          >
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
