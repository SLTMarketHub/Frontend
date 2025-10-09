import React, { useRef } from "react";
import ProductCard from "./ProductCard";

export default function CategoryCard(props) {
    const cards = Array.from({ length: 100 });
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth*0.8 : clientWidth*0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="mx-4 md:mx-20 mt-4 mb-4 relative">
            <div className="flex justify-between mb-2">
                <h2 className="text-3xl font-bold self-center-safe content-center cursor-pointer inline-block">{props.categoryName || "Category Name"}</h2>
                <a href={`/category/${props.categoryName}`} className="text-blue-900 font-semibold self-center-safe content-center cursor-pointer inline-block hover:underline">See All</a>
            </div>

            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full z-10 cursor-pointer p-2 shadow-md text-blue-950 bg-white hover:shadow-xl hover:scale-110 transition-transform duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                className="flex gap-10 overflow-x-auto scrollbar-hide py-2 ml-8 mr-8 p-6 pb-10 scroll-smooth"
            >
                {cards.map((_, index) => (
                    <div key={index} className="flex-none w-40 md:w-48 lg:w-56" id={props.id}>
                        <ProductCard
                            productName={`Product ${index + 1}`}
                            productDescription="This is a sample description for testing."
                            productPrice={(Math.random() * 1000).toFixed(2)}
                            id={`product-${index}`}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10 cursor-pointer p-2 shadow-md text-blue-950 bg-white hover:shadow-xl hover:scale-110 transition-transform duration-300 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </button>
        </section>
    );
}
