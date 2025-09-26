"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  } as const;
  const variants = {
    primary: "bg-[#2563EB] text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-[#F97316] text-white hover:bg-orange-600 focus-visible:ring-orange-400",
    ghost: "bg-transparent hover:bg-white/10 text-gray-200 focus-visible:ring-gray-400",
    outline: "border border-white/20 text-gray-200 hover:bg-white/10",
    danger: "bg-[#EF4444] text-white hover:bg-red-600 focus-visible:ring-red-400",
  } as const;
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};
