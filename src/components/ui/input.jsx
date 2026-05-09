export function Input({ className = "", ...props }) {
    return (
      <input
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500 transition ${className}`}
        {...props}
      />
    )
  }
  