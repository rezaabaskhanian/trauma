export function Card({ className = "", children, ...props }) {
    return (
      <div
        className={`rounded-xl border bg-white text-gray-800 shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  export function CardHeader({ className = "", children, ...props }) {
    return (
      <div className={`flex flex-col p-6 pb-2 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  export function CardTitle({ className = "", children, ...props }) {
    return (
      <h2 className={`text-xl font-bold ${className}`} {...props}>
        {children}
      </h2>
    )
  }
  
  export function CardContent({ className = "", children, ...props }) {
    return (
      <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  