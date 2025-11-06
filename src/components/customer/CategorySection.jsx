import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/customer/CategoryCard";
import { ThreeDots } from "react-loader-spinner";

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const VITE_ENDPOINT_TMF620_CATEGORY = import.meta.env.VITE_ENDPOINT_TMF620_CATEGORY;

    useEffect(() => {
        async function fetchCategory() {
            try {
                console.log("Fetching categories from:", import.meta.env.VITE_ENDPOINT_TMF620_CATEGORY);
                const res = await fetch(`${VITE_ENDPOINT_TMF620_CATEGORY}`);
                const data = await res.json();

                if (Array.isArray(data?.data)) {
                    setCategories(data.data);
                    console.log("Fetched categories:", categories);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, []);

   if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <ThreeDots variant="pulsate" color="#4DB848" size="medium" text="" textColor="" ariaLabel="loading" />
            </div>
        );
    }

    return (
        <div>
            {categories.length === 0 ? (
                <p className="text-gray-500 text-center">No categories available</p>
            ) : (
                categories.map((category) => (
                    <div key={category.id} id={category.id}>
                        <CategoryCard
                            categoryName={category.name}
                            id={category.id}
                        />
                    </div>
                ))
            )}
        </div>
    );
}
