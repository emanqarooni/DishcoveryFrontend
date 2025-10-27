import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Client from "../services/api"

const UserProfileEdit = () => {
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

  //here we fetch user info for editing
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
        setPreview(`http://localhost:3000${user.image}`)
      } catch (error) {
        console.error("Error fetching user for edit:", error)
      }
    }
    fetchUserData()
  }, [userId])

  //handling user inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  //handling image chnage
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  //submit data
  const handleSubmit = async (e) => {
    e.preventDefault()
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

      setMessage("Profile updated successfully!")
      setTimeout(() => navigate(`/users/${userId}`), 1500)
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Failed to update profile. Please try again.")
    }
  }

  return (
    <div>
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Gender:</label>
          <select
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

        <div>
          <label>Profile Image:</label>
          {preview && (
            <div>
              <img src={preview} alt="preview" width="120" height="120" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button type="submit">Save Changes</button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => navigate(`/users/${userId}`)}>Cancel</button>
    </div>
  )
}

export default UserProfileEdit
