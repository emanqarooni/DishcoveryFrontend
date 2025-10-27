const RecipeCard = () => {

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await Client.get(`/recipe`)
      } catch (error) {}
    }
  }, [])

  return(
    <div></div>
  )
}

export default RecipeCard
