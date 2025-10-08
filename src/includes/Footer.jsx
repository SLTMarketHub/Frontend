export default function Footer() {
  return (
    <footer className="bg-white shadow-inner p-4 text-center text-gray-500 fixed bottom-0 w-full">
      &copy; {new Date().getFullYear()} Seller Portal. All rights reserved.
    </footer>
  );
}
