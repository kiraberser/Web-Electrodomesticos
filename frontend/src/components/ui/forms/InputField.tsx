import * as React from "react"
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  dark?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, dark = false, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        dark 
          ? "border-gray-600 bg-gray-800 text-gray-100 placeholder:text-gray-400" 
          : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-700",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }