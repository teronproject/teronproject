/**
 * Table component with header, body, and pagination support.
 */
export default function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

Table.Head = function TableHead({ children, className = "" }) {
  return (
    <thead className={`border-b border-border-primary ${className}`}>
      {children}
    </thead>
  );
};

Table.Body = function TableBody({ children, className = "" }) {
  return <tbody className={className}>{children}</tbody>;
};

Table.Row = function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={`border-b border-border-primary last:border-b-0 hover:bg-surface-primary/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

Table.Header = function TableHeader({ children, className = "", ...props }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

Table.Cell = function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`px-4 py-3 text-text-secondary ${className}`} {...props}>
      {children}
    </td>
  );
};
