import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MealState {
    meals: string[];
}

const initialState: MealState = {
    meals: [],
};

export const mealSlice = createSlice({
    name: "meals",
    initialState,
    reducers: {
        addMeal: (state, action: PayloadAction<string>) => {
            const hasMeal = state.meals.includes(action.payload);
            if (!hasMeal) {
                state.meals.push(action.payload);
            }
        },
        delMeal: (state, action: PayloadAction<string>) => {
            const newItems = state.meals.filter((el) => el !== action.payload);
            state.meals = newItems;
        },
    },
});

export const { addMeal, delMeal } = mealSlice.actions;
export default mealSlice.reducer;
