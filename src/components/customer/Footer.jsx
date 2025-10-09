import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d2446] text-gray-300 pt-10 pb-4 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">MarketHub</h2>
          <p className="text-sm">
            Your trusted marketplace for buying and selling products with ease.  
            Explore categories, find the best deals, and connect with sellers securely.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/offers" className="hover:text-white">Offers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Facebook /></a>
            <a href="#" className="hover:text-white"><Instagram /></a>
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Linkedin /></a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
         Powered by
         <a href="https://www.tmforum.org/" target="_blank" rel="noopener noreferrer">
         <img src="/assets/images/TM-Forum.png" alt="TM Forum" className="ml-auto mr-auto h-6 mt-2 cursor-pointer" />
          </a>
      </div>
      <div className="mt-4 pt-2 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MarketHub. All rights reserved.
      </div>
    </footer>
  );
}
