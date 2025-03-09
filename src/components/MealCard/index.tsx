import { useQuery } from "@tanstack/react-query";

import styles from "./meal-card.module.css";
import { Link } from "react-router-dom";
import { BadgeX, CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMeal, delMeal } from "../../store/mealSlice";
import { RootState } from "../../store/store";
import { FullMealType } from "../../constants";

const fetchMeal = async (id: string) => {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (!res.ok) {
        throw new Error("Помилка завантаження прийому їжі");
    }
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
};

export default function MealCard({ meal }: { meal: any }) {
    const dispatch = useDispatch();
    const selectedMeals = useSelector((store: RootState) => store.meals.meals);
    const isInBucket = selectedMeals.includes(meal.idMeal);

    const addHendler = () => {
        dispatch(addMeal(meal.idMeal));
    };
    const delHendler = () => {
        dispatch(delMeal(meal.idMeal));
    };

    const {
        data: mealData,
        isLoading: isLoadingMeal,
        isError: isErrorMeal,
    } = useQuery<FullMealType | null>({
        queryKey: ["meal", meal.idMeal],
        queryFn: () => fetchMeal(meal.idMeal),
    });

    if (isLoadingMeal || isErrorMeal) return <></>;

    return (
        <div className={styles.card}>
            <Link to={"/dishes/meal/" + meal.idMeal}>
                <img
                    src={mealData?.strMealThumb}
                    alt={mealData?.strMeal}
                    className={styles.image}
                />
            </Link>
            <h3 className={styles.title}>{mealData?.strMeal}</h3>
            <h4>{mealData?.strCategory}</h4>
            <h4>{mealData?.strArea}</h4>
            {isInBucket ? (
                <BadgeX className={styles.add} onClick={delHendler} />
            ) : (
                <CirclePlus className={styles.add} onClick={addHendler} />
            )}
        </div>
    );
}
