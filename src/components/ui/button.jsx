export function Button({ className = "", children, ...props }) {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  