import { useQueries, useQuery } from "@tanstack/react-query";
import styles from "./Home.module.css";
import { MealCard } from "../../components";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/Pagination";
import debounce from "lodash.debounce";

const fetchCategories = async () => {
    const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    if (!res.ok) {
        throw new Error("Помилка завантаження категорій");
    }
    return res.json();
};

const fetchMealsByCategory = async (category: string) => {
    console.log(category);

    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    if (!res.ok) {
        throw new Error(`Помилка завантаження категорії ${category}`);
    }
    return res.json();
};

type CategoryType = {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
};

type CategorysType = {
    categories: CategoryType[];
};

export type MealType = {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
};

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const {
        data: categoryData,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
    } = useQuery<CategorysType>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const mealQueries = useQueries({
        queries: (categoryData?.categories || []).map((category) => ({
            queryKey: ["meals", category.strCategory],
            queryFn: () => fetchMealsByCategory(category.strCategory),
            enabled: !!categoryData,
        })),
    });

    const isLoadingMeals = mealQueries.some((query) => query.isLoading);
    const isErrorMeals = mealQueries.some((query) => query.isError);
    const allMeals = mealQueries.flatMap((query) => query.data?.meals || []);

    const itemsPerPage = 14;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(allMeals.length / itemsPerPage);

    const indexOfLastMeal = currentPage * itemsPerPage;
    const indexOfFirstMeal = indexOfLastMeal - itemsPerPage;
    const currentMeals = allMeals.slice(indexOfFirstMeal, indexOfLastMeal);

    const [filter, setFilter] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    if (isLoadingCategories || isLoadingMeals) return <h2>Завантаження</h2>;
    if (isErrorCategories || isErrorMeals) return <h2>Помилка завантаження</h2>;

    return (
        <div>
            <input
                type="string"
                value={filter}
                onChange={handleInputChange}
            ></input>
            <select
                defaultValue=""
                onChange={handleCategoryChange}
                className="rounded-lg p-1"
            >
                <option value="" disabled>
                    Виберіть категорію їжі
                </option>
                {categoryData?.categories
                    ? categoryData.categories.map((cat) => (
                          <option key={cat.idCategory} value={cat.strCategory}>
                              {cat.strCategory}
                          </option>
                      ))
                    : null}
            </select>
            <h1>Страви</h1>
            <div className={styles.grid}>
                {currentMeals.map((meal: MealType) =>
                    filter && meal.strMeal.includes(filter) ? (
                        <MealCard
                            key={meal.idMeal}
                            meal={meal}
                            cat={selectedCategory}
                        />
                    ) : null
                )}
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
