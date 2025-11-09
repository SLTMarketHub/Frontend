import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { ThreeDots } from "react-loader-spinner";

export default function CategoryCard({ id, categoryName }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const CATEGORY_ENDPOINT = `${import.meta.env.VITE_ENDPOINT_TMF620_OFFERINGS_BY_CATEGORY}/${id}`;
    const PRICE_ENDPOINT = import.meta.env.VITE_ENDPOINT_TMF620_PRICE;

    useEffect(() => {
        console.log(id)
        console.log(CATEGORY_ENDPOINT)
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${CATEGORY_ENDPOINT}?limit=15`);
                const data = await res.json();

                if (!Array.isArray(data?.data)) {
                    setProducts([]);
                    return;
                }

                // Fetch prices in parallel
                const productsWithPrices = await Promise.all(
                    data.data.map(async (product) => {
                        if (product.productOfferingPrice?.length) {
                            try {
                                const priceId = product.productOfferingPrice[0].id;
                                const priceRes = await fetch(`${PRICE_ENDPOINT}${priceId}`);
                                const priceData = await priceRes.json();

                                const priceValue =
                                    priceData?.price?.taxIncludedAmount?.value ??
                                    priceData?.price?.dutyFreeAmount?.value ??
                                    null;

                                const priceUnit =
                                    priceData?.price?.taxIncludedAmount?.unit ??
                                    priceData?.price?.dutyFreeAmount?.unit ??
                                    "";

                                return {
                                    ...product,
                                    resolvedPrice: priceValue ? `${priceValue} ${priceUnit}` : "N/A",
                                };
                            } catch (err) {
                                console.error("Error fetching price:", err);
                                return { ...product, resolvedPrice: "N/A" };
                            }
                        }
                        return { ...product, resolvedPrice: "N/A" };
                    })
                );

                setProducts(productsWithPrices);
            } catch (err) {
                console.error("Error fetching category offerings:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id, CATEGORY_ENDPOINT, PRICE_ENDPOINT]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const { clientWidth } = scrollRef.current;
        const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <ThreeDots height="80" width="80" radius="9" color="#4DB848" ariaLabel="loading" visible={true} />
            </div>
        );
    }

    return (
        <section className="mx-4 md:mx-20 mt-4 mb-4 relative">
            <div className="flex justify-between mb-2">
                <h2 className="text-3xl font-bold">{categoryName || "Category Name"}</h2>
                <a href={`/category/${id}`} className="text-blue-900 font-semibold hover:underline">
                    See All
                </a>
            </div>

            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full z-10 p-2 shadow-md text-blue-950 bg-white cursor-pointer hover:shadow-xl hover:scale-110 transition-transform duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                className="flex gap-10 overflow-x-auto scrollbar-hide py-2 ml-8 mr-8 p-6 pb-10 scroll-smooth"
            >
                {products.length === 0 ? (
                    <p className="text-gray-500">No products available</p>
                ) : (
                    products.map(product => (
                        <div key={product.id || product._id} className="flex-none w-40 md:w-48 lg:w-56">
                            <ProductCard
                                id={product.id}
                                productName={product.name || "No Name"}
                                productDescription={product.description || "No Description"}
                                productPrice={product.resolvedPrice || "0.00"}
                                productImage={product.productImage || "/assets/images/placeholderImg.jpg"}
                                productDetails={product}
                                className="w-full"
                            />
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10 p-2 shadow-md text-blue-950 bg-white cursor-pointer hover:shadow-xl hover:scale-110 transition-transform duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </button>
        </section>
    );
}
