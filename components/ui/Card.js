"use client";

export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={`card ${hover ? "card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "" }) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};