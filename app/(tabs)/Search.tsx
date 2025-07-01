import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import { Recipe } from '@/types/types';
import { mealAPI } from '@/services/mealAPI';
import { useDebounce } from '../../hooks/useDebounce.js'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SearchBar from '../componenets/SearchBar';
import MealList from '../componenets/MealList';

const index = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>('');
  const [meals, setMeals] = useState<Recipe[]>([])
  const [initialLoad, setInitialLoad] = useState<Boolean>(true)
  const [loading, setLoading] = useState<Boolean>(false)


  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];
  const debounceSearchQuery = useDebounce(searchQuery, 300)

  const performSearch = async (query: string | null) => {
    if (query == '') {
      const res = await mealAPI.getRandomMeals(12)
      const data = res.map((meal: any) => mealAPI.transformMealData(meal))
      return data.filter((meal): meal is Recipe => meal != null)
    }

    const NameRes = await mealAPI.searchMealByName(query)
    let results = NameRes

    if (results.length === 0) {
      const IngredientRes = await mealAPI.searchMealByIngredient(encodeURIComponent(query ?? ''))
      results = IngredientRes
    }

    if (results.length === 0) {
      results = await mealAPI.searchMealByArea(query)
    }

    return results.map((meal: any) => mealAPI.transformMealData(meal)).filter((meal: any) => meal !== null)
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await performSearch("")
        setMeals(res)
      } catch (error) {
        console.log("Error fetching initial data", error)
      } finally {
        setInitialLoad(false)
      }
    }
    loadInitialData()

  }, [])

  useEffect(() => {
    if (initialLoad) return

    const loadData = async () => {
      setLoading(true)
      try {
        const res = await performSearch(debounceSearchQuery)
        setMeals(res)
      } catch (error) {
        console.log("Error fetching initial data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [debounceSearchQuery, initialLoad])

  const onSearch = (text: string) => {
    setSearchQuery(text)
  }
  return (
    <ScrollView style={[{ backgroundColor: theme.background }]}>
      <SafeAreaView style={[styles.maincontainer,]}>
        <View style={[styles.headerBox]}>
          <SearchBar value={searchQuery}
            onChangeText={onSearch}
          />
        </View>


        {
          searchQuery ?
            <Text style={[styles.searchtext, { color: theme.textLight }]}>
              Search Result for "{searchQuery}"</Text>
            :
            <Text style={[styles.searchtext, { color: theme.textLight }]}>
              Popular Recipies</Text>
        }
        {
          (initialLoad || loading) &&
          <ActivityIndicator animating={true} size={35} style={[styles.loader]} />
        }
        <MealList meals={meals} />
      </SafeAreaView>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({
  maincontainer: {
    paddingHorizontal: 10
  },

  headerBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  searchtext: {
    fontSize: 20,
    marginHorizontal: 10
  },
  loader: {
    marginTop: 50
  },
})