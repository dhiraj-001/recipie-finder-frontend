const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export const mealAPI = {

  searchMealByName: async (query) =>{
    try {
      const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
      const data = res.json()
      return data.meals || []
    } catch (error) {
      console.log("Error fetching meal",error)
      return [];
    }
  },

  searchMealDetail: async (id) =>{
    try {
      const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
      const data = res.json()
      return data.meal || []
    } catch (error) {
      console.log("Error fetching meal detail",error)
      return [];
    }
  },

  featuredMeal: async () =>{
    try {
      const res = await fetch(`${BASE_URL}/random.php`)
      const data =await res.json()
      return data.meals[0]
    } catch (error) {
      console.log("Error fetching featured meal ",error)
      return [];
    }
  },

  mealCategory:async () =>{
    try {
      const res = await fetch(`${BASE_URL}/categories.php`)
      const data = res.json()
      return data.meal || []
    } catch (error) {
      console.log("Error fetching meal categories",error)
      return [];
    }
  },

  transformMealData: (meal) => {
    if (!meal) return null;
    // Extract ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }

    // Split instructions into steps
    let instructions = [];
    if (meal.strInstructions) {
      // Split on newlines or periods followed by a newline or space
      instructions = meal.strInstructions
        .split(/\r?\n|(?<=\.)\s+/)
        .map(step => step.trim())
        .filter(step => step.length > 0);
    }

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions, // now an array of steps
      tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
      thumbnail: meal.strMealThumb,
      youtube: meal.strYoutube,
      ingredients,
    };
  }
}