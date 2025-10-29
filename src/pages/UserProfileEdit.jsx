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

  //handle image changes
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

    try {
      const data = new FormData()
      data.append("username", formData.username)
      data.append("email", formData.email)
      data.append("gender", formData.gender)
      if (formData.image) data.append("image", formData.image)

      const res = await Client.put(`/users/${userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      //update user state
      const updatedUser = res.data.user
      setUser(updatedUser)

      setMessage(res.data.message || "Profile updated successfully!")
      setTimeout(() => navigate(`/users/${userId}`), 1500)
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else {
        setError("Failed to update profile. Please try again.")
      }
    }
  }

  return (
    <div className="user-profile-edit-container">
      <div className="edit-card">
        <h2 className="edit-title">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="input-group">
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="input-group">
            <label>Profile Image</label>
            {preview && (
              <div className="edit-img-preview">
                <img src={preview} alt="preview" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <div className="edit-btn-row">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/users/${userId}`)}
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
