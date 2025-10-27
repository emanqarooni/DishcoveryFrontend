import { Routes, Route, Navigate } from "react-router-dom"
import Register from "./pages/SignUp" // adjust path if your file is elsewhere
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Default route redirects to Register */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Placeholder for Login Page */}
        <Route path="/login" element={<h2>Login Page (Coming Soon)</h2>} />

        {/* 404 Fallback */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </div>
  )
}

export default App
