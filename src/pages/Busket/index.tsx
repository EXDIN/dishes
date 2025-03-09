import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MealCardFull } from "../../components";
import styles from "./busket.module.css";

export default function Busket() {
    const selectedMeals = useSelector((store: RootState) => store.meals.meals);
    return (
        <div className={styles.grid}>
            {selectedMeals.length
                ? selectedMeals.map((meal: string, index) => (
                      <MealCardFull key={index} meal={meal} />
                  ))
                : null}
        </div>
    );
}
