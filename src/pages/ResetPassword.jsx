import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Client from "../services/api"
import "../Auth.css"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      const res = await Client.post(`/auth/reset/${token}`, {
        password,
        confirmPassword,
      })

      setMessage(
        res.data.message || "Password reset successful. Redirecting..."
      )
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Please try again."
      setError(errMsg)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter and confirm your new password</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="input-wrapper">
            <label htmlFor="password">New Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className="input-wrapper">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-error">{error}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={!password || !confirmPassword}
          >
            Reset Password
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

export default ResetPassword
