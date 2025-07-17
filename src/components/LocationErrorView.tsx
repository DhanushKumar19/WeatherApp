import { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    locationError: string;
    handleRequestLocationPermission: () => Promise<void>;
    handleRefresh: () => Promise<void>;
}

const LocationErrorView: FC<Props> = ({ locationError, handleRequestLocationPermission, handleRefresh }) => (
    <View style={styles.locationErrorContainer}>
        <Text style={styles.locationErrorText}>{locationError}</Text>
        {locationError.toLowerCase().includes('permission') && (
            <TouchableOpacity style={styles.searchButton} onPress={handleRequestLocationPermission}>
                <Text style={styles.searchButtonText}>Request Location Permission</Text>
            </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleRefresh}>
            <Text style={styles.searchButtonText}>Refresh</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    locationErrorContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    locationErrorText: {
        color: 'red',
        marginBottom: 16,
    },
    searchButton: {
        backgroundColor: 'royalblue',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 10
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LocationErrorView;
