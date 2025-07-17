import { FC } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    searchLocation: string;
    setSearchLocation: (val: string) => void;
    handleSearch: () => Promise<void>;
}

const SearchBar: FC<Props> = ({ searchLocation, setSearchLocation, handleSearch }) => (
    <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Enter city"
            value={searchLocation}
            onChangeText={setSearchLocation}
            onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: 'royalblue',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SearchBar;
