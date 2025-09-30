import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import Product from "../../components/customer/Product";
import ProductCard from "../../components/customer/ProductCard";

export default function ProductPage(props) {
    const navigate = useNavigate();
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const productId = props.productId || "1";
    const [product, setProduct] = useState(null);
    const containerRef = useRef(null);
    const [maxCards, setMaxCards] = useState(0);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_GROUP = import.meta.env.VITE_API_GROUP_TMF622;
    const RESOURCE = import.meta.env.VITE_RESOURCE_TMF622;

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            const cardWidth = 250;
            const gap = 16;
            const count = Math.floor((width + gap) / (cardWidth + gap));
            setMaxCards(count);
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Fetch main product
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`${BASE_URL}/${API_GROUP}/${RESOURCE}/${productId}`);
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        }
        fetchProduct();
    }, [productId]);

    // Fetch related products
    useEffect(() => {
        async function fetchRelated() {
            if (!product) return;

            try {
                const res = await fetch(`${BASE_URL}/${API_GROUP}/${RESOURCE}`);
                const data = await res.json();

                // filter same category, exclude main product
                let sameCategory = data.filter(
                    (p) =>
                        p.productCategory === product.productCategory &&
                        p.productId !== product.productId
                );

                // shuffle array
                sameCategory = sameCategory.sort(() => Math.random() - 0.5);

                setRelatedProducts(sameCategory);
            } catch (err) {
                console.error("Error fetching related products:", err);
            }
        }
        fetchRelated();
    }, [product]);

    return (
        <div className="bg-[#fefefe] min-w-[700px]">
            <Header />
            <section className="mx-4 md:mx-30 mt-4 mb-4">
                <div className="flex mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-900 font-semibold cursor-pointer hover:underline"
                    >
                        Back
                    </button>
                </div>
                <Product />
                <div className="h-[1px] bg-gray-300 my-4"></div>
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-center">Product Details</h3>
                    <p>Product details will be displayed here.</p>
                </div>
                <div className="h-[1px] bg-gray-300 my-4"></div>
                <div>
                    <h2 className="text-blue-900 text-3xl font-bold text-left mb-2">
                        More To Love
                    </h2>
                    <div ref={containerRef} className="w-full">
                        <div className="flex gap-4 justify-center">
                            {relatedProducts.slice(0, maxCards).map((p) => (
                                <div key={p.id} className="w-[250px]">
                                    <ProductCard key={productId} {...p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
