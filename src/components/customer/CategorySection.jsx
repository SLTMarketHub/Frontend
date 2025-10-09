import React from "react";
import CategoryCard from "../../components/customer/CategoryCard";

export default function CategorySection() {

    const cards = Array.from({ length: 5 });

    return (
        <div>
            {cards.map((_, index) => (
                <div key={index} id={index}>
                    <CategoryCard
                        categoryName={`Category ${index + 1}`}
                        id={`category-${index}`}
                    />
                </div>
            ))}
        </div>
    );
}