import Link from "next/link";

/**
 * Teron Logo component.
 * @param {{ className?: string, size?: "sm" | "md" | "lg" }} props
 */
export default function Logo({ className = "", size = "md" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`font-bold tracking-tight ${sizes[size]} ${className}`}
    >
      <span className="text-text-primary">ter</span>
      <span className="text-accent">on</span>
    </Link>
  );
}
