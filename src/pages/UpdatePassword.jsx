import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Client from "../services/api"

const UpdatePassword = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Password validation
  const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = formData

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.")
      return false
    }

    if (!passwordValidation.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long, include one uppercase, one lowercase, and one special character."
      )
      return false
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const res = await Client.put(`/auth/update/${id}`, formData)
      setMessage(res.data.status || "Password updated successfully.")
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })

      // Redirect after success
      setTimeout(() => navigate(`/users/${id}`), 2000)
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Failed to update password."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="update-password-container">
      <div className="col">
        <h2>Update Password</h2>

        {/* Success Popup */}
        {message && (
          <div className="popup popup-success">
            <div className="popup-content">
              <span className="popup-icon">✓</span>
              <span>{message}</span>
              <button onClick={() => setMessage("")} className="popup-close">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Error Popup */}
        {error && (
          <div className="popup popup-error">
            <div className="popup-content">
              <span className="popup-icon">⚠</span>
              <span>{error}</span>
              <button onClick={() => setError("")} className="popup-close">
                ×
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="oldPassword">Old Password:</label>
            <div className="password-field">
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="newPassword">New Password:</label>
            <div className="password-field">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword
