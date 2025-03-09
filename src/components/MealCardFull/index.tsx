import { useQuery } from "@tanstack/react-query";
import styles from "./meal-card.module.css";
import { Link } from "react-router-dom";

const fetchMeal = async (id: string) => {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (!res.ok) {
        throw new Error("Помилка завантаження прийому страви");
    }
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
};

export default function MealCardFull({ meal }: { meal: string }) {
    const {
        data: mealData,
        isLoading: isLoadingMeal,
        isError: isErrorMeal,
    } = useQuery({
        queryKey: ["meal", meal],
        queryFn: () => fetchMeal(meal),
    });

    if (isLoadingMeal) return <p>Завантаження...</p>;
    if (isErrorMeal || !mealData) return <p>Помилка завантаження страви</p>;

    const ingredients = Array.from({ length: 20 }, (_, i) => ({
        ingredient: mealData[`strIngredient${i + 1}`],
        measure: mealData[`strMeasure${i + 1}`],
    })).filter((item) => item.ingredient && item.ingredient.trim() !== "");

    return (
        <div className={styles.card}>
            <Link to={"/meal/" + mealData.idMeal}>
                <img
                    src={mealData?.strMealThumb}
                    alt={mealData?.strMeal}
                    className={styles.image}
                />
            </Link>

            <h3 className={styles.title}>{mealData?.strMeal}</h3>
            <h4>{mealData?.strCategory}</h4>
            <h4>{mealData?.strArea}</h4>

            <h2>Інгредієнти</h2>
            <ul className={styles.ingredients}>
                {ingredients.map((item, index) => (
                    <li key={index}>
                        {item.ingredient} - {item.measure}
                    </li>
                ))}
            </ul>
            <h2>Як приготувати</h2>
            <p className={styles.instructions}>{mealData?.strInstructions}</p>
        </div>
    );
}
