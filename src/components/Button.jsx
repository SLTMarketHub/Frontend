export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-brand-500 text-brand-900 hover:bg-brand-400 p-2 w-full rounded-2xl ${className}`}
    >
      {children}
    </button>
  );
}
