import { useState } from "react"
import { SignInUser } from "../services/Auth"
import { useNavigate, Link } from "react-router-dom"

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

      // Redirect after short delay
      setTimeout(() => {
        navigate(`/users/${userData.id}`)
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
    <div className="col signin">
      <img src="/images/signin.png" alt="Sign In Title Image" />

      <form className="col" onSubmit={handleSubmit}>
        {/* Email */}
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

        {/* Password */}
        <label htmlFor="password">Password</label>
        <div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            onChange={handleChange}
            value={formValues.password}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!formValues.email || !formValues.password}
        >
          Sign In
        </button>

        {/* Feedback messages */}
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>
        )}
      </form>

      {/* Navigation links */}
      <p>
        Don’t have an account? <Link to="/register">Sign up</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
    </div>
  )
}

export default Login
