import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4 animate-fadeIn">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-4">Oops! Page Not Found</h2>
            <p className="mb-6">
                The page you are looking for does not exist. Try going back to the homepage.
            </p>
            <Link
                to="/"
                className="button primary"
            >
                Go Home
            </Link>
        </div>
    );
}

export default NotFoundPage;
