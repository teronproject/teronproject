"use client";

/**
 * Card component with optional header and footer.
 */
export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={`bg-surface-primary border border-border-primary rounded-md ${
        hover ? "hover:border-border-secondary transition-colors" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-border-primary ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-border-primary ${className}`}>
      {children}
    </div>
  );
};
