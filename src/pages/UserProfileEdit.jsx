import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Client, { BASE_URL } from "../services/api"

const UserProfileEdit = ({ user, setUser }) => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    image: null,
  })
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await Client.get(`/users/${userId}/edit`)
        const user = res.data.user
        setFormData({
          username: user.username || "",
          email: user.email || "",
          gender: user.gender || "",
          image: null,
        })
        setPreview(`${BASE_URL}${user.image}`)
      } catch (error) {
        console.error("Error fetching user for edit:", error)
        setError("Failed to fetch user data.")
      }
    }
    fetchUserData()
  }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle image changes with styled file input
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const data = new FormData()
      data.append("username", formData.username)
      data.append("email", formData.email)
      data.append("gender", formData.gender)
      if (formData.image) data.append("image", formData.image)

      const res = await Client.put(`/users/${userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Update user state
      const updatedUser = res.data.user
      setUser(updatedUser)

      setMessage(res.data.message || "Profile updated successfully!")

      // Success popup will redirect
      setTimeout(() => navigate(`/users/${userId}`), 1500)
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else {
        setError("Failed to update profile. Please try again.")
      }
    }
    setLoading(false)
  }

  return (
    <div className="user-profile-edit-container">
      <div className="col">
        <h2>Edit Profile</h2>

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

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="input-wrapper">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="input-wrapper">
            <label>Profile Image:</label>

            {/* Image Preview */}
            {preview && (
              <div className="image-preview">
                <img
                  src={preview}
                  alt="Preview"
                  className="profile-preview-image"
                />
              </div>
            )}

            {/* Styled File Input - Same as Form.jsx */}
            <div className="file-input-wrapper">
              <label
                className={`file-input-label ${
                  formData.image ? "has-file" : ""
                }`}
              >
                <span className="file-input-text">
                  {formData.image
                    ? "✅ Change Image"
                    : "📸 Choose Profile Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input-hidden"
                />
              </label>
              {formData.image && (
                <span className="file-selected-name">
                  Selected: {formData.image.name}
                </span>
              )}
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/users/${userId}`)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfileEdit
