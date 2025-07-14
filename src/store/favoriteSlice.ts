import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "../types/weather";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoriteState {
    locations: Location[];
    loading: boolean;
}

const initialState: FavoriteState = {
    locations: [],
    loading: false,
};

export const loadFavorites = createAsyncThunk(
    'favorites/load',
    async () => {
        const stored = await AsyncStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    }
);

export const saveFavorites = createAsyncThunk(
    'favorites/save',
    async (locations: Location[]) => {
        await AsyncStorage.setItem('favorites', JSON.stringify(locations));
        return locations;
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state: FavoriteState, action: PayloadAction<Location>) => {
            const newLocation = action.payload;
            state.locations.push(newLocation);
        },
        removeFavorite: (state: FavoriteState, action: PayloadAction<Location>) => {
            state.locations = state.locations.filter(loc => loc.id !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadFavorites.fulfilled, (state, action: PayloadAction<Location[]>) => {
                state.locations = action.payload;
                state.loading = false;
            });
    },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;