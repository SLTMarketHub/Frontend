import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import ProductCard from "../../components/customer/ProductCard";
import { FaArrowUp } from "react-icons/fa";

export default function ProductCategory(props) {
    const cards = Array.from({ length: 50 });
    const navigate = useNavigate();
    const [showTopBtn, setShowTopBtn] = useState(false);
    const { categoryName } = useParams();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-[#fefefe] min-w-[700px]">
            <Header />
            <section className="mx-4 md:mx-20 mt-4 mb-4">
                <div className="flex mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-900 font-semibold cursor-pointer hover:underline"
                    >
                        Back
                    </button>
                </div>
                <div className="flex justify-center mb-2">
                    <h2 className="text-3xl font-bold text-center">
                        {categoryName || "Category Name"}
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-[4rem] gap-y-[2rem] p-6">
                    {cards.map((_, index) => (
                        <ProductCard
                            key={index}
                            productName={`Product ${index + 1}`}
                            productDescription="This is a sample description for testing."
                            productPrice={(Math.random() * 1000).toFixed(2)}
                            id={`product-${index}`}
                            className="w-full"
                        />
                    ))}
                </div>
            </section>
            <Footer />

            {showTopBtn && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer"
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
}
