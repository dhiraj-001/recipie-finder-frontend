import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useState } from 'react'
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { setTheme, switchTheme } from '../redux/Slices/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { mealAPI } from "../../services/mealAPI.js"
import { ActivityIndicator, Card, Chip } from 'react-native-paper';
import { Recipe } from '@/types/types';
import MealList from '../componenets/MealList';
import axios from 'axios';
import { API_URL } from '@/services/FavouriteFetch';
import { addFavoruites, fetchFavorites } from '../redux/Slices/FavouritesSlice';
import { useUser } from '@clerk/clerk-expo';
// Define Category type
type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryDescription: string;
  strCategoryThumb: string;
};

const index = () => {

  const color = useColorScheme()
  const dispatch = useDispatch()

  useEffect(() => {
    if (color === "dark") {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  }, [color, dispatch]);


  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];
  const [featured, setFeatured] = useState<ReturnType<typeof mealAPI.transformMealData> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catMeal, setCatMeal] = useState<Recipe[]>([]);
  const [mealShowCategory, setMealShowCategory] = useState<string>('')
  const [categoryByLoading, setCategoryByLoading] = useState<boolean>(false)
  const { user } = useUser()
  const userId= user?.id


  useEffect(() => {
    const fetchFeatured = async () => {
      const res = await mealAPI.featuredMeal();
      const formated = mealAPI.transformMealData(res)
      setFeatured(formated);
    };

    const fetchCategories = async () => {
      const categories = await mealAPI.mealCategory();
      // Move 'Beef' category to the end
      const beefIndex = categories.findIndex((cat: Category) => cat.strCategory === 'Beef');
      if (beefIndex !== -1) {
        const beef = categories.splice(beefIndex, 1)[0];
        categories.push(beef);
      }
      setCategories(categories);
      setMealShowCategory(categories[0].strCategory);
      setCategoryByLoading(true)
      fetchByCategories(mealShowCategory);
    }

    fetchFeatured();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchByCategories(mealShowCategory)
  }, [mealShowCategory])

  const fetchByCategories = async (mealShowCategory: string) => {
    const res = await mealAPI.mealByCategory(mealShowCategory)
    const mealsArray = await Promise.all(
      res.map(async (item: { idMeal: string, strMeal: string, strMealThumb: string }) => {
        const data = await mealAPI.searchMealByName(item.strMeal)
        return mealAPI.transformMealData(data[0])
      })
    )
    setCatMeal(mealsArray.filter((meal): meal is Recipe => meal !== null))
    setCategoryByLoading(false)
  }

 let fav = useSelector((state: ReturnType<typeof store.getState>) => state.favourites.favourites)

useEffect(()=>{
  if(userId) dispatch(fetchFavorites(userId))
 
},[dispatch,userId])


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[{ backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      <SafeAreaView style={[styles.maincontainer,]}>
        <View style={[styles.headerBox]}>
          <Text style={[styles.headTxt, { color: theme.textLight }]}>
            Recipies 😋
          </Text>
          <Pressable onPress={() => dispatch(switchTheme())}>
            {
              themeName === "dark" ? <MaterialIcons name="wb-sunny" size={24} color={theme.textLight} /> : <Octicons name="moon" size={24} color={theme.textLight} />
            }
          </Pressable>
        </View>
        <View >
          {featured && (
            <Card style={[styles.featuredCard]}>
              <ImageBackground
                source={{ uri: featured.thumbnail }}
                style={[styles.featuredCardImage]}
                imageStyle={{ borderRadius: 16 }}
              >
                <Chip icon="star" mode='flat' style={[styles.featuredChip, { backgroundColor: theme.background, borderColor: theme.border }]}>Featured</Chip>
                <TouchableOpacity style={[styles.addFevBtn, { backgroundColor: theme.textLight }]}>
                  <MaterialIcons name="bookmark-add" size={30} color='#af5ff6' />
                </TouchableOpacity>
                <View style={{ backgroundColor: 'rgba(3, 14, 68, 0.4)', padding: 10 }}>
                  <Text style={[styles.featuredHeadTxt, { color: theme.textLight }]}>
                    {featured.name}
                  </Text>
                  <Text style={[styles.featuredBodyTxt, { color: theme.cardLight }]}>{featured.category} | {featured.area}</Text>
                </View>
              </ImageBackground>
            </Card>
          )}
        </View>


        {/* Categories Horizontal List */}
        <View style={styles.categoriesContainer}>
          <Text style={[styles.categoriesTitle, { color: theme.textLight }]}>Categories</Text>
          <ScrollView style={[styles.categoriesContainerIn]} horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.idCategory}
                onPress={() => {
                  setMealShowCategory(cat.strCategory);
                  setCategoryByLoading(true)
                  setCatMeal([])
                  fetchByCategories(cat.strCategory);
                }}
              >
                <Card style={[styles.categoryCard, { backgroundColor: mealShowCategory === cat.strCategory ? theme.card : theme.cardLight, shadowColor: theme.shadow, borderColor: theme.border, borderWidth: mealShowCategory === cat.strCategory ? 2 : 0 }]}>
                  <ImageBackground
                    source={{ uri: cat.strCategoryThumb }}
                    style={styles.categoryImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.categoryOverlay}>
                      <Text style={[styles.categoryName, { color: theme.textLight }]}>{cat.strCategory}</Text>
                    </View>
                  </ImageBackground>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={[styles.searchtext, { color: theme.textLight }]}>
          Recipes for {mealShowCategory}</Text>
        {categoryByLoading &&
          <ActivityIndicator animating={true} size={35} style={[styles.loader]} />
        }
        <MealList meals={catMeal} />

      </SafeAreaView>
    </ScrollView>
  )
}


export default index

const styles = StyleSheet.create({
  maincontainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingRight: 0
  },
  headerBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10
  },
  headTxt: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  featuredCard: {
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 8
  },
  featuredCardImage: {
    width: '100%',
    height: 230,
    justifyContent: 'flex-end'
  },
  featuredChip: {
    marginRight: 'auto',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  featuredHeadTxt: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  featuredBodyTxt: {
    marginTop: 3,
    fontSize: 15
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  categoryOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  categoryName: {

    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  categoriesTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  categoriesContainerIn: {
    marginTop: 15,

  },
  loader: {
    marginTop: 50
  },
  searchtext: {
    fontSize: 20,
  },
  addFevBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 5
  }
})