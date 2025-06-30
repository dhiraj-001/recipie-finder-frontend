const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export const mealAPI = {

  searchMealByName: async (query) =>{
    try {
      const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
      const data =await res.json()
      return data.meals || []
    } catch (error) {
      console.log("Error fetching meal",error)
      return [];
    }
  },

  searchMealDetail: async (id) =>{
    try {
      const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
      const data =await res.json()
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
      const data =await res.json()
      return data.categories || []
    } catch (error) {
      console.log("Error fetching meal categories",error)
      return [];
    }
  },

  mealByCategory: async (category) =>{
    try {
      const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
      const data =await res.json()
      return data.meals || []
    } catch (error) {
      console.log("Error fetching meal categories",error)
      return [];
    }
  },

  getRandomMeals: async (count) =>{
    let meals = []
    for(let i=0; i<count; i++){
      const res = await fetch(`${BASE_URL}/random.php`)
      const data = await res.json()
      meals.push(data.meals[0])
    }
    return meals
  },

  searchMealByIngredient: async (query) =>{
    try {
    const res = await fetch(`${BASE_URL}/filter.php?i=${query}`)
    const data = await res.json()
    return data || []
    } catch (error) {
      console.log("Error fetching meals by ingredient",error)
      return []
    }
  },
  searchMealByArea: async (query) =>{
    try {
    const res = await fetch(`${BASE_URL}/filter.php?a=${query}`)
    const data = await res.json()
    return data || []
    } catch (error) {
      console.log("Error fetching meals by ingredient",error)
      return []
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