import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RegisterUser } from "../services/Auth"

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
      const res = await RegisterUser(formValues)
      console.log("Registered user:", res)

      setSuccess("Registration successful! Redirecting to login...")
      setFormValues(initialState)

      // Wait a moment before redirecting so user can see the message
      setTimeout(() => {
        navigate("/signin")
      }, 1500)
    } catch (err) {
      console.error("Registration error:", err)
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      )
    }
  }

  return (
    <div className="col register">
      <img src="/images/register.png" alt="Register Title Image" />

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="input-wrapper">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            placeholder="username"
            onChange={handleChange}
            value={formValues.username}
            required
          />
        </div>

        {/* Email */}
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="example@gmail.com"
            onChange={handleChange}
            value={formValues.email}
            required
          />
        </div>

        {/* Password */}
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
            value={formValues.password}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="input-wrapper">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            onChange={handleChange}
            value={formValues.confirmPassword}
            required
          />
        </div>

        {/* Gender Dropdown */}
        <div className="input-wrapper">
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        {/* Submit button*/}
        <button
          type="submit"
          disabled={
            !formValues.username ||
            !formValues.email ||
            !formValues.password ||
            !formValues.confirmPassword ||
            !formValues.gender ||
            formValues.password !== formValues.confirmPassword
          }
        >
          Register
        </button>

        {/* Feedback */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  )
}

export default Register
