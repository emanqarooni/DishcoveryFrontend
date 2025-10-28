import MealClient from "./mealDB"

//searching meal by name
export const searchMealByName = async (name) => {
  const res = await MealClient.get(`/search.php?s=${name}`)
  return res.data.meals
}

//getting random meal
export const getRandomMeal = async () => {
  const res = await MealClient.get(`/random.php`)
  return res.data.meals[0]
}

//getting all categories
export const getMealCategories = async () => {
  const res = await MealClient.get(`/categories.php`)
  return res.data.categories
}

//filtering by category
export const getMealsByCategory = async (category) => {
  const res = await MealClient.get(`/filter.php?c=${category}`)
  return res.data.meals
}
