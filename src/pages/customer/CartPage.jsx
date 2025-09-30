import React, { useState } from "react";
import CartItem from "../../components/customer/cart/CartItem";
import CartSummary from "../../components/customer/cart/CartSummary";
import AddressSelector from "../../components/customer/cart/AddressSelector";
import ShippingOptions from "../../components/customer/cart/ShippingOptions";
import PaymentMethods from "../../components/customer/cart/PaymentMethods";

const CartPage = () => {
  // Example state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 120, qty: 1, image: "/assets/headphones.png" },
    { id: 2, name: "Smart Watch", price: 200, qty: 2, image: "/assets/watch.png" },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [address, setAddress] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [payment, setPayment] = useState(null);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side - Cart Items */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
          />
        ))}

        <AddressSelector address={address} setAddress={setAddress} />
        <ShippingOptions shipping={shipping} setShipping={setShipping} />
        <PaymentMethods payment={payment} setPayment={setPayment} />
      </div>

      {/* Right side - Summary */}
      <div>
        <CartSummary
          cartItems={cartItems}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
        />
      </div>
    </div>
  );
};

export default CartPage;
