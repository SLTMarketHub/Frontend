import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import ProductCard from "../../components/customer/ProductCard";
import { FaArrowUp } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

export default function ProductCategory() {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [showTopBtn, setShowTopBtn] = useState(false);

    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);

    const ENDPOINT_OFFERING = import.meta.env.VITE_ENDPOINT_TMF620_OFFERING;
    const ENDPOINT_CATEGORY = import.meta.env.VITE_ENDPOINT_TMF620_CATEGORY;
    const ENDPOINT_PRICE = import.meta.env.VITE_ENDPOINT_TMF620_PRICE;

    // Scroll button
    useEffect(() => {
        const handleScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch category name
    useEffect(() => {
        const fetchCategory = async () => {
            setCategoryLoading(true);
            try {
                const res = await fetch(`${ENDPOINT_CATEGORY}${categoryId}`);
                const data = await res.json();
                setCategoryName(data?.name || "No Information");
            } catch (err) {
                console.error("Error fetching category:", err);
                setCategoryName("No Information");
            } finally {
                setCategoryLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId, ENDPOINT_CATEGORY]);

    // Fetch products + resolve prices
    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true);
            try {
                const res = await fetch(`${ENDPOINT_OFFERING}?limit=100`);
                const data = await res.json();

                if (!Array.isArray(data?.data)) {
                    setProducts([]);
                    return;
                }

                // Filter by category (robust)
                const filtered = data.data.filter((product) => {
                    if (!product.category) return false;
                    if (Array.isArray(product.category)) return product.category.some(c => c.id === categoryId || c === categoryId);
                    if (typeof product.category === "object") return product.category.id === categoryId;
                    return product.category === categoryId; // string id
                });

                // Resolve prices in parallel
                const productsWithPrices = await Promise.all(
                    filtered.map(async (product) => {
                        if (product.productOfferingPrice?.length) {
                            try {
                                const priceId = product.productOfferingPrice[0].id;
                                const priceRes = await fetch(`${ENDPOINT_PRICE}${priceId}`);
                                const priceData = await priceRes.json();
                                const priceValue = priceData?.price?.taxIncludedAmount?.value ?? priceData?.price?.dutyFreeAmount?.value ?? null;
                                const priceUnit = priceData?.price?.taxIncludedAmount?.unit ?? priceData?.price?.dutyFreeAmount?.unit ?? "";
                                return {
                                    ...product,
                                    resolvedPrice: priceValue ? `${priceValue} ${priceUnit}` : "N/A"
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
                console.error("Error fetching products:", err);
                setProducts([]);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId, ENDPOINT_OFFERING, ENDPOINT_PRICE]);

    return (
        <div className="bg-[#fefefe] min-w-[700px]">
            <Header />

            <section className="mx-4 md:mx-20 mt-4 mb-4">
                <div className="flex mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-900 font-semibold cursor-pointer hover:underline flex items-center"
                    >
                        {/* Arrow Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 28 28"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                                clipRule="evenodd"
                            />
                        </svg>

                        {/* Text */}
                        Back
                    </button>
                </div>


                <div className="flex justify-center mb-6">
                    <h2 className="text-3xl font-bold text-center">
                        {categoryLoading ? "Loading..." : categoryName || "Category Name"}
                    </h2>
                </div>

                {productsLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <ThreeDots height="80" width="80" radius="9" color="#4DB848" ariaLabel="loading" visible={true} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-[8rem] gap-y-[2rem] p-6">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard
                                    key={product.id || product._id}
                                    id={product.id}
                                    productName={product.name || "No Name"}
                                    productDescription={product.description || "No Description"}
                                    productPrice={product.resolvedPrice || "0.00"}
                                    productImage={product.productImage || "/assets/images/placeholderImg.jpg"}
                                    productDetails={product}
                                    className="w-full"
                                />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">
                                No products found in this category.
                            </p>
                        )}
                    </div>
                )}
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
