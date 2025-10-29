import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ForgotPasswordService } from "../services/Auth"
import "../Auth.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    try {
      const res = await ForgotPasswordService({ email })
      setMessage(
        res.message ||
          "If this email is registered, a reset link has been sent."
      )
      setEmail("")
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password?</h2>
          <p className="auth-subtitle">We'll send you a reset link</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={!email}>
            Send Reset Link
          </button>
        </form>

        <div className="auth-footer">
          <p>Remembered your password?</p>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
