import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "./Meal.module.css";

const fetchMeal = async (id: string) => {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (!res.ok) {
        throw new Error("Помилка завантаження страви");
    }
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
};

export default function Meal() {
    const { id } = useParams();
    const productId = id || "1";

    const {
        data: meal,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["meal", id],
        queryFn: () => fetchMeal(productId),
        enabled: !!productId,
    });

    if (isLoading) return <p>Завантаження...</p>;
    if (isError || !meal) return <p>Помилка завантаження страви</p>;

    const ingredients = Array.from({ length: 20 }, (_, i) => ({
        ingredient: meal[`strIngredient${i + 1}`],
        measure: meal[`strMeasure${i + 1}`],
    })).filter((item) => item.ingredient && item.ingredient.trim() !== "");

    return (
        <div className={styles.container}>
            <h1>{meal.strMeal}</h1>
            <p className={styles.category}>
                {meal.strCategory} - {meal.strArea}
            </p>
            <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className={styles.image}
            />

            <h2>Інгредієнти</h2>
            <ul className={styles.ingredients}>
                {ingredients.map((item, index) => (
                    <li key={index}>
                        {item.ingredient} - {item.measure}
                    </li>
                ))}
            </ul>

            <h2>Як приготувати</h2>
            <p className={styles.instructions}>{meal.strInstructions}</p>

            {meal.strYoutube && (
                <div className={styles.video}>
                    <h2>Відео</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${
                            meal.strYoutube.split("=")[1]
                        }`}
                        title="Recipe Video"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
}
