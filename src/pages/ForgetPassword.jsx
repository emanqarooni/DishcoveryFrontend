import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ForgotPasswordService } from "../services/Auth"

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
    <div className="col forgot-password">
      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={!email}>
          Send Reset Link
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p>Remembered your password?</p>
      <Link to="/login">Back to Login</Link>
    </div>
  )
}

export default ForgotPassword
