const { useState, useEffect } = require("react")
import { BASE_URL, Client } from "../services/api.js"

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await Client.get(`${BASE_URL}/recipe`)
      } catch (error) {}
    }
  }, [])
}

export default AllRecipes
