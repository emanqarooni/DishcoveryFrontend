import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { RegisterUser } from "../services/Auth"
import "../Auth.css"

const Register = () => {
  const navigate = useNavigate()

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  }

  const [formValues, setFormValues] = useState(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Client-side validation
    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formValues.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      const res = await RegisterUser(formValues)
      console.log("Registered user:", res)

      setSuccess("Registration successful! Redirecting to login...")
      setFormValues(initialState)

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (err) {
      console.error("Registration error:", err)
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      )
    }
  }

  const isFormValid =
    formValues.username &&
    formValues.email &&
    formValues.password &&
    formValues.confirmPassword &&
    formValues.gender &&
    formValues.password === formValues.confirmPassword

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Join us and start your culinary journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formValues.username}
              required
            />
          </div>

          {/* Email */}
          <div className="input-wrapper">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              value={formValues.email}
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                onChange={handleChange}
                value={formValues.password}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                onChange={handleChange}
                value={formValues.confirmPassword}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Gender Dropdown */}
          <div className="input-wrapper">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formValues.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select your gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {/* Feedback Messages */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Submit button */}
          <button type="submit" className="submit-btn" disabled={!isFormValid}>
            Create Account
          </button>
        </form>

        {/* Link to login */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
