import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Client from "../services/api"

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

      setMessage(res.data.message || "Password has been reset successfully.")
      setPassword("")
      setConfirmPassword("")

      //redirectig to login page after 3 seconds
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Please try again."
      setError(errMsg)
    }
  }

  return (
    <div className="col reset-password">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {/* New Password */}
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
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm New Password */}
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" disabled={!password || !confirmPassword}>
          Reset Password
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p>Remembered your password?</p>
      <Link to="/login">Back to Login</Link>
    </div>
  )
}

export default ResetPassword
