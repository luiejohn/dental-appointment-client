import React from "react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({
  variant = "default",
  className,
  ...props
}: ButtonProps) {
  const base = "px-4 py-2 font-medium rounded";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100",
  } as const;
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}
