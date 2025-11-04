import React from "react";
import Header from "../../components/customer/Header";
import CategorySection from "../../components/customer/CategorySection";
import Footer from "../../components/customer/Footer";

export default function HomePage() {
    return (
        <div className="bg-gray-100  min-w-[700px]">
            <Header />
            <section
                className="relative text-white min-h-[30rem] p-4 flex mb-6 overflow-hidden group select-none"
                role="banner"
                aria-label="Market Hub Introduction"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                    style={{ backgroundImage: "url('/assets/images/telecom-products.jpg')" }}
                ></div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content on top */}
                <div className="relative text-left text-xl font-bold mt-20 mb-6 w-full max-w-3xl p-10">
                    <h1 className="text-5xl font-bold mb-4">
                        Your Gateway to <br /> Telecommunication Products
                    </h1>
                    <p>
                        Discover, compare, and activate telecommunications and digital
                        services from trusted providers through Market Hub.
                        <br/>
                        Powered by TM Forum standards for seamless integration.
                    </p>
                </div>
            </section>
            <CategorySection />
            <Footer />
        </div>
    );
}
