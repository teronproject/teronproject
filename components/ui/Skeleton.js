/**
 * Skeleton loader component for loading states.
 */
export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-tertiary ${className}`}
      {...props}
    />
  );
}

Skeleton.Text = function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-surface-tertiary"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
};

Skeleton.Circle = function SkeletonCircle({ size = 40, className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-surface-tertiary ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
