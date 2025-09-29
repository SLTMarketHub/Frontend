import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6 select-none">
      <img
        src="/assets/images/404.jpg"
        alt="404 Not Found"
        className="w-[40rem]"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-900 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
