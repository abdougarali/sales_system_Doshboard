import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

export function TableRow({ 
  children, 
  className = '',
  hover = true 
}: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <tr className={`${hover ? 'hover:bg-gray-50 transition-colors' : ''} ${className}`}>
      {children}
    </tr>
  );
}

export function TableHeader({ 
  children, 
  className = '' 
}: { 
  children?: ReactNode; 
  className?: string;
}) {
  return (
    <th
      className={`px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ 
  children, 
  className = '' 
}: { 
  children?: ReactNode; 
  className?: string;
}) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
