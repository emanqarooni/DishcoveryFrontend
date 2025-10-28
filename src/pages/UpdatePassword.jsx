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

    if (!validateForm()) return

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
    }
  }

  return (
    <div>
      <h2>Update Password</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
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

        <div>
          <label htmlFor="newPassword">New Password:</label>
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

        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
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

        <button type="submit">Update Password</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default UpdatePassword
