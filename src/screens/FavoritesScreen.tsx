import { FC, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { RootStackParamList } from '../../App';
import { loadFavorites, saveFavorites, removeFavorite } from '../store/favoriteSlice';
import { Location } from '../types/weather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export const FavoritesScreen: FC<Props> = ({ navigation }) => {
    const { locations, loading } = useSelector((state: RootState) => state.favorites);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadFavorites());
    }, [dispatch]);

    const handleLocationSelection = (location: Location) => {
        navigation.popTo('Home', { location: location.name });
    };

    const handleLocationRemoval = (location: Location) => {
        Alert.alert(
            "Remove Favorite",
            `Are you sure you want to remove ${location.name} from favorites?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    onPress: () => {
                        dispatch(removeFavorite(location));
                        dispatch(saveFavorites(locations.filter(loc => loc.id !== location.id)));
                    }
                }
            ]
        );
    };
    
    const renderFavorites = () => {
        if (loading) {
            return <Text>Loading...</Text>;
        }
        if (locations.length === 0) {
            return <Text>No favorites added yet.</Text>;
        }
        return locations.map((location) => (
            <TouchableOpacity key={location.id} onPress={() => handleLocationSelection(location)}>
                <View style={styles.favoriteItem}>
                    <Text style={styles.favoriteText}>{location.name}, {location.country}</Text>
                    <TouchableOpacity onPress={() => handleLocationRemoval(location)}>
                        <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            {renderFavorites()}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'whitesmoke',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    favoriteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    favoriteText: {
        fontSize: 18,
    },
    removeButton: {
        color: 'red',
        fontWeight: 'bold',
    },
    favoritesButton: {
        marginRight: 20,
        color: 'blue',
    },
});
