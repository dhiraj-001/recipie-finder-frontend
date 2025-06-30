import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { THEMES } from '@/constants/colors';
import store from '../redux/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SearchBarProps {
  value: string | null;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder }) => {
  const themeName = useSelector((state: ReturnType<typeof store.getState>) => state.theme.theme);
  const theme = THEMES[themeName as keyof typeof THEMES];

  return (
    <View style={[styles.searchContainer, { backgroundColor: theme.cardLight, borderColor: theme.border, shadowColor: theme.shadow }]}> 
      <MaterialIcons name="search" size={22} color={theme.secBackGround} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.secBackGround, backgroundColor: 'transparent' }]}
        placeholder={placeholder || 'Search recipes...'}
        placeholderTextColor={theme.secBackGround}
        value={value ?? ''}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
      {(value ?? '').length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <MaterialIcons name="close" size={20} color={theme.secBackGround} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});