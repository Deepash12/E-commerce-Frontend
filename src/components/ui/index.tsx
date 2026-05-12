import React, { ReactNode, FC } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';


// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner: FC<{ className?: string }> = ({ className }) => (
  <div className={cn('w-7 h-7 border-2 border-obsidian-700 border-t-gold-400 rounded-full animate-spin', className)} />
);

export const LoadingPage: FC = () => (
  <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
    <Spinner className="w-10 h-10" />
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}
export const EmptyState: FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center animate-fade-up">
    <div className="text-obsidian-700">{icon}</div>
    <h3 className="font-display text-2xl font-medium text-obsidian-300">{title}</h3>
    {description && <p className="text-obsidian-500 max-w-xs text-sm">{description}</p>}
    {action}
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}
export const Modal: FC<ModalProps> = ({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={cn('card border border-obsidian-700 w-full overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-up', maxWidth)}>
        <div className="flex items-center justify-between p-5 border-b border-obsidian-800">
          <h2 className="section-title">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost p-1.5"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 p-5 border-t border-obsidian-800">{footer}</div>}
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}
export const Pagination: FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i);
  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      <button
        className="btn btn-ghost btn-sm px-2.5"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >←</button>
      {pages.map(i => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={cn(
            'w-8 h-8 text-xs rounded-sm border transition-all',
            page === i
              ? 'bg-gold-400/10 border-gold-400 text-gold-400'
              : 'border-obsidian-700 text-obsidian-500 hover:border-obsidian-500 hover:text-obsidian-300'
          )}
        >{i + 1}</button>
      ))}
      <button
        className="btn btn-ghost btn-sm px-2.5"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >→</button>
    </div>
  );
};

// ─── Form Field ───────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}
export const Field: FC<FieldProps> = ({ label, error, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
import { ORDER_STATUS_CONFIG } from '@/utils';
import type { OrderStatus } from '@/types';

export const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
  const cfg = ORDER_STATUS_CONFIG[status] ?? { label: status, className: 'badge-gray' };
  return <span className={cn('badge', cfg.className)}>{cfg.label}</span>;
};
export { default as HeroSection } from "./HeroSection";
export { default as ProductCard } from "./ProductCard";
export { default as ProductGrid } from "./ProductGrid";
export { default as FiltersSidebar } from "./FiltersSidebar";
export { default as ProductToolbar } from "./ProductToolbar";
