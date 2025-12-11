import Axios from "axios"

export const BASE_URL = "https://dishcovery-backend-wk53.onrender.com/"

const Client = Axios.create({ baseURL: BASE_URL })

// Intercepts every request axios makes
Client.interceptors.request.use(
  async (config) => {
    // Reads the token in localStorage
    const token = localStorage.getItem("token")
    // if the token exists, we set the authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    // We return the new config if the token exists or the default config if no token exists.
    return config
    // Provides the token to each request that passes through axios
  },
  async (error) => {
    console.log({ msg: "Axios Interceptor Error!", error })
    throw error
  }
)

export default Client
