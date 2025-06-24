import { ImageBackground, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';

type Meal = {
  idMeal:string;
  strMeal: string;
  strMealThumb:string;
}

type Props = {
  meals:Meal[]
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 5;
const CARD_WIDTH = (width / 2) - (CARD_MARGIN*3);

const MealListByCategory:React.FC<Props> = ({meals}) => {
const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
const theme = THEMES[themeName as keyof typeof THEMES];

  return (
    <FlashList
      data={meals}
      renderItem={({ item }) => (
        <View style={[styles.cardContainer, { borderColor: theme.border }]}>
          <ImageBackground
            source={{ uri: item.strMealThumb }}
            style={styles.cardImage}
            imageStyle={{ borderRadius: 10, height:CARD_WIDTH,width:CARD_WIDTH }}
          >
              <Text style={[styles.cardText,{color:theme.background, borderColor:theme.secBackGround, backgroundColor:theme.border
              }]}>{item.strMeal}</Text>
        
          </ImageBackground>
        </View>
      )}
      estimatedItemSize={CARD_WIDTH + 2 * CARD_MARGIN}
      numColumns={2}
      contentContainerStyle={{
         padding: CARD_MARGIN,

       }}
    />
  )
}

export default MealListByCategory
const styles = StyleSheet.create({
  list:{
    marginTop:20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    marginVertical: CARD_MARGIN,
    borderWidth: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderRadius: 5,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardText: {
    padding: 9,
    fontWeight: 'bold',
    fontSize: 16,
  },

});