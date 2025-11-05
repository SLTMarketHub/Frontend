import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import Product from "../../components/customer/Product";
import ProductCard from "../../components/customer/ProductCard";
import { ThreeDots } from "react-loader-spinner";

export default function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const VITE_ENDPOINT_TMF620_OFFERING = import.meta.env.VITE_ENDPOINT_TMF620_OFFERING;
  const PRICE_ENDPOINT = import.meta.env.VITE_ENDPOINT_TMF620_PRICE;

  const fetchPrice = async (priceId) => {
    try {
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

      return priceValue ? `${priceValue} ${priceUnit}` : "N/A";
    } catch (err) {
      console.error("Error fetching price:", err);
      return "N/A";
    }
  };

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const res = await fetch(`${VITE_ENDPOINT_TMF620_OFFERING}${id}`);
        const data = await res.json();

        if (data) {
          let resolvedPrice = "N/A";
          if (data.productOfferingPrice?.length) {
            resolvedPrice = await fetchPrice(data.productOfferingPrice[0].id);
          }

          setProductDetails({ ...data, resolvedPrice });

          if (data.category?.[0]?.id) {
            fetchRelatedProducts(data.category[0].id, data.id);
          }
        } else {
          setProductDetails(null);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setProductDetails(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProductDetails();
  }, [id, VITE_ENDPOINT_TMF620_OFFERING, PRICE_ENDPOINT]);

  const fetchRelatedProducts = async (categoryId, excludeProductId) => {
    setRelatedLoading(true);
    try {
      const res = await fetch(`${VITE_ENDPOINT_TMF620_OFFERING}?category=${categoryId}`);
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        const filtered = data.data.filter((p) => p.id !== excludeProductId);

        const productsWithPrice = await Promise.all(
          filtered.map(async (p) => {
            let resolvedPrice = "N/A";
            if (p.productOfferingPrice?.length) {
              resolvedPrice = await fetchPrice(p.productOfferingPrice[0].id);
            }
            return { ...p, resolvedPrice };
          })
        );

        setRelatedProducts(productsWithPrice);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
      setRelatedProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  return (
    <div className="bg-[#fefefe] min-w-[700px] flex flex-col min-h-screen">
      <Header />
      {loading ? (
        <div className="flex justify-center items-center py-10 min-h-screen">
          <ThreeDots color="#4DB848" height={60} width={60} />
        </div>
      ) : (
        <section className="mx-48 md:mx-30 mt-4 mb-4 flex-1">
          {/* Back Button */}
          <div className="flex mb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-900 font-semibold cursor-pointer hover:underline flex items-center"
            >
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
              Back
            </button>
          </div>

          {/* Main Product */}
          {productDetails && (
            <div>
              <Product productDetails={productDetails} />
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-300 my-4" />

          {/* Related Products */}
          <h2 className="text-blue-900 text-3xl font-bold text-left mb-4">
            More To Love
          </h2>

          {relatedLoading ? (
            <div className="flex justify-center items-center py-6">
              <ThreeDots color="#4DB848" height={50} width={50} />
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[16rem] shrink-0 border-0 p-3 rounded-lg shadow">
                  <ProductCard productDetails={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related products found.</p>
          )}
        </section>
      )}
      <Footer />
    </div>
  );
}
