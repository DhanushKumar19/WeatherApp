/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './src/store';
import { loadFavorites } from './src/store/favoriteSlice';

export type RootStackParamList = {
  Home: { location: string } | undefined;
  Favorites: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

const FavoritesButton = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList> }) => (
  <TouchableOpacity onPress={() => navigation.push('Favorites')}>
    <Text style={styles.favoritesButton}>Favorites</Text>
  </TouchableOpacity>
);

const renderFavoritesButton = (navigation: StackNavigationProp<RootStackParamList>) => (
  <FavoritesButton navigation={navigation} />
);

const RootStack = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Weather App',
          headerTitleAlign: 'center',
          headerRight: () => renderFavoritesButton(navigation),
        })}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  // TODO: Handle Error boundary
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favoritesButton: {
    marginRight: 20,
    color: 'blue'
  }
});

export default App;
