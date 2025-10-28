import MealClient from "./mealDB"

//get all meals
export const getAllMeals = async () => {
  const res = await MealClient.get(`/search.php?s=`)
  return res.data.meals
}

//searching meal by name
export const searchMealByName = async (name) => {
  const res = await MealClient.get(`/search.php?s=${name}`)
  return res.data.meals
}

//get meal details by id
export const getMealById = async (id) => {
  const res = await MealClient.get(`/lookup.php?i=${id}`)
  return res.data.meals[0]
}

//filtering by category
export const getMealsByCategory = async (category) => {
  const res = await MealClient.get(`/filter.php?c=${category}`)
  return res.data.meals
}
