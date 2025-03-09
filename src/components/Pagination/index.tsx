import styles from "./pagination.module.css";

export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage,
}: {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePages = () => {
        if (totalPages <= 10) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let pages = [];
        if (currentPage <= 7) {
            pages = [1, 2, 3, 4, 5, 6, 7, "...", totalPages];
        } else if (currentPage >= totalPages - 6) {
            pages = [
                1,
                "...",
                totalPages - 6,
                totalPages - 5,
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        } else {
            pages = [
                1,
                "...",
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2,
                "...",
                totalPages,
            ];
        }

        return pages;
    };

    const pageNumbers = generatePages();

    return (
        <div className={styles.pagination}>
            <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
            >
                « Попередня
            </button>

            {pageNumbers.map((num, index) => (
                <button
                    key={index}
                    className={num === currentPage ? styles.active : ""}
                    onClick={() => typeof num === "number" && goToPage(num)}
                    disabled={num === "..."}
                >
                    {num}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
            >
                Наступна »
            </button>
        </div>
    );
}
