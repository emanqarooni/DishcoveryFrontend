import axios from "axios"

export const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

const MealClient = axios.create({ baseURL: MEALDB_BASE_URL })

export default MealClient
