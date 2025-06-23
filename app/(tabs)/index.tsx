import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { setTheme, switchTheme } from '../redux/Slices/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { mealAPI } from "../../services/mealAPI.js"
import { Card, Chip } from 'react-native-paper';

const index = () => {
  const color = useColorScheme()
  const dispatch = useDispatch()
  const { signOut } = useClerk()

  useEffect(() => {
    if (color === "dark") {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  }, [color, dispatch]);

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  const [featured, setFeatured] = useState<ReturnType<typeof mealAPI.transformMealData> | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      const res = await mealAPI.featuredMeal();
      const formated = mealAPI.transformMealData(res)
      setFeatured(formated);

    };
    fetchFeatured();
  }, []);


  return (
    <ScrollView style={[{ backgroundColor: theme.background }]}>
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
        <View>
          {featured && (
            <Card style={[styles.featuredCard]}>
              <ImageBackground
                source={{ uri: featured.thumbnail }}
                style={[styles.featuredCardImage]}
                imageStyle={{ borderRadius: 16 }}
              >
                <Chip icon="star" mode='flat' style={[styles.featuredChip, { backgroundColor: theme.background, borderColor: theme.border }]}>Featured</Chip>

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
      </SafeAreaView>
    </ScrollView>
  )
}



export default index

const styles = StyleSheet.create({
  maincontainer: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  headerBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20
  },
  headTxt: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  featuredCard: {
    marginTop: 35,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative'
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
    marginTop:3,
    fontSize:15
    }
})