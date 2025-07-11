import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<StackProps> = ({navigation, route}) => {
    // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Button
                onPress={() => navigation.navigate('Favorites')}
                title="Go to Favorites"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});