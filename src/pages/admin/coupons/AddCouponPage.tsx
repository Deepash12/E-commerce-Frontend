import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Tag, Percent, IndianRupee,
  CalendarDays, ShoppingCart, ToggleLeft, ToggleRight,
  Copy, Check, Search, AlertCircle, FileText,
  Users, Globe, TrendingDown, Info,
} from 'lucide-react';
import { couponAPI } from './../../../api/service';
import { LoadingPage, Modal, Pagination, Spinner, Field, EmptyState } from './../../../components/ui';
import { cn } from './../../../utils';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
//  TYPES  (add these to your src/types/index.ts)
// ─────────────────────────────────────────────────────────────────────────────
type CouponType = 'PERCENTAGE' | 'FLAT';

interface Coupon {
  couponId:             number;       // adjust to your response field name
  couponCode:           string;
  couponType:           CouponType;
  description:          string;
  minOrderAmount:       number;
  discountAmount:       number;
  maximumDiscountAmount:number;
  expiryAt:             string;       // ISO datetime string
  validFrom:             string;       // ISO datetime string
  isActive:             boolean;
  perUserLimit:         number;
  globalUsageLimit:     number;
}

// ─── Matches AddCouponRequestDTO exactly ─────────────────────────────────────
interface CouponFormData {
  couponCode:            string;
  couponType:            CouponType;
  description:           string;
  minOrderAmount:        string;
  discountAmount:        string;
  maximumDiscountAmount: string;
  expiryAt:              string;   // "yyyy-MM-ddTHH:mm"
  validFrom:             string;   // "yyyy-MM-ddTHH:mm"
  isActive:              boolean;
  perUserLimit:          string;
  globalUsageLimit:      string;
}

const defaultForm: CouponFormData = {
  couponCode:            '',
  couponType:            'PERCENTAGE',
  description:           '',
  minOrderAmount:        '',
  discountAmount:        '',
  maximumDiscountAmount: '',
  expiryAt:              '',
  validFrom:             '',
  isActive:              true,
  perUserLimit:          '',
  globalUsageLimit:      '',
};

// ─────────────────────────────────────────────────────────────────────────────
//  VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
type FormErrors = Partial<Record<keyof CouponFormData, string>>;

function validate(f: CouponFormData): FormErrors {
  const e: FormErrors = {};

  if (!f.couponCode.trim())
    e.couponCode = 'Coupon code is required';
  else if (!/^[A-Z0-9_-]{3,30}$/.test(f.couponCode))
    e.couponCode = 'Only uppercase letters, numbers, _ and – (3–30 chars)';

  if (!f.description.trim())
    e.description = 'Description is required';

  if (!f.discountAmount)
    e.discountAmount = 'Discount amount is required';
  else if (+f.discountAmount <= 0)
    e.discountAmount = 'Must be greater than 0';
  else if (f.couponType === 'PERCENTAGE' && +f.discountAmount > 100)
    e.discountAmount = 'Percentage cannot exceed 100';

  if (!f.maximumDiscountAmount)
    e.maximumDiscountAmount = 'Max discount cap is required';
  else if (+f.maximumDiscountAmount <= 0)
    e.maximumDiscountAmount = 'Must be greater than 0';

  if (!f.minOrderAmount)
    e.minOrderAmount = 'Minimum order amount is required';
  else if (+f.minOrderAmount <= 0)
    e.minOrderAmount = 'Must be greater than 0';

  if (!f.validFrom)
    e.validFrom = 'Valid from date is required';

  if (!f.expiryAt)
    e.expiryAt = 'Expiry date is required';
  else if (f.validFrom && new Date(f.expiryAt) <= new Date(f.validFrom))
    e.expiryAt = 'Expiry must be after valid-from date';
  else if (new Date(f.expiryAt) <= new Date())
    e.expiryAt = 'Expiry date must be in the future';

  if (!f.perUserLimit)
    e.perUserLimit = 'Per-user limit is required';
  else if (+f.perUserLimit <= 0)
    e.perUserLimit = 'Must be at least 1';

  if (!f.globalUsageLimit)
    e.globalUsageLimit = 'Global usage limit is required';
  else if (+f.globalUsageLimit <= 0)
    e.globalUsageLimit = 'Must be at least 1';

  return e;
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const isExpired  = (d: string) => new Date(d) < new Date();
const isNotValid = (d: string) => new Date(d) > new Date();

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// "now + N days" as "yyyy-MM-ddTHH:mm" for datetime-local input
const dtPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 16);
};

const nowDt = () => new Date().toISOString().slice(0, 16);

// ─────────────────────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const CouponStatusBadge: React.FC<{ coupon: Coupon }> = ({ coupon }) => {
  if (!coupon.isActive)               return <span className="badge badge-gray">Inactive</span>;
  if (isExpired(coupon.expiryAt))     return <span className="badge badge-red">Expired</span>;
  if (isNotValid(coupon.validFrom))   return <span className="badge badge-blue">Scheduled</span>;
  return                                     <span className="badge badge-green">Live</span>;
};

const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="btn btn-ghost btn-sm px-1.5"
      title="Copy code"
    >
      {copied ? <Check size={11} className="text-gold-400" /> : <Copy size={11} />}
    </button>
  );
};

const TypeToggle: React.FC<{ value: CouponType; onChange: (v: CouponType) => void }> = ({ value, onChange }) => (
  <div className="flex rounded-sm border border-obsidian-700 overflow-hidden">
    {(['PERCENTAGE', 'FLAT'] as CouponType[]).map(t => (
      <button key={t} type="button" onClick={() => onChange(t)}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] tracking-widest uppercase font-medium transition-all duration-150',
          value === t
            ? 'bg-gold-400/10 text-gold-400 border-r border-gold-400/30'
            : 'text-obsidian-500 hover:text-obsidian-300 hover:bg-obsidian-800/50'
        )}>
        {t === 'PERCENTAGE' ? <Percent size={12} /> : <IndianRupee size={12} />}
        {t === 'PERCENTAGE' ? 'Percentage' : 'Flat Amount'}
      </button>
    ))}
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode; label: string; value: string | number; accent?: boolean;
}> = ({ icon, label, value, accent }) => (
  <div className={cn('card border-obsidian-800 p-5 flex flex-col gap-3', accent && 'border-gold-400/20 bg-gold-400/5')}>
    <div className={cn('w-9 h-9 rounded-sm flex items-center justify-center', accent ? 'bg-gold-400/10 text-gold-400' : 'bg-obsidian-800 text-obsidian-400')}>
      {icon}
    </div>
    <div>
      <p className={cn('font-display text-2xl font-medium', accent ? 'text-gold-400' : 'text-obsidian-100')}>{value}</p>
      <p className="text-[10px] tracking-widest uppercase text-obsidian-500 mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Tooltip hint ──────────────────────────────────────────────────────────────
const Hint: React.FC<{ text: string }> = ({ text }) => (
  <span className="group relative inline-flex ml-1.5 cursor-help">
    <Info size={11} className="text-obsidian-600 group-hover:text-gold-400 transition-colors" />
    <span className="pointer-events-none absolute left-5 -top-1 z-50 w-52 rounded-sm border border-obsidian-700 bg-obsidian-900 px-3 py-2 text-xs text-obsidian-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
      {text}
    </span>
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AddCouponPage: React.FC = () => {
  const [coupons,    setCoupons]    = useState<Coupon[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search,     setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'EXPIRED' | 'INACTIVE'>('ALL');

  const [modal,    setModal]   = useState(false);
  const [form,     setForm]    = useState<CouponFormData>(defaultForm);
  const [errors,   setErrors]  = useState<FormErrors>({});
  const [saving,   setSaving]  = useState(false);
  const [touched,  setTouched] = useState<Partial<Record<keyof CouponFormData, boolean>>>({});

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleting,  setDeleting]  = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await couponAPI.getAll({ pageNumber: page, pageSize: 12 });
      const data = res.data as { content?: Coupon[]; totalPages?: number };
      setCoupons(data.content ?? (res.data as Coupon[]) ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  // ── Filtered list ───────────────────────────────────────────────────────
  const filtered = coupons.filter(c => {
    const matchSearch = !search || c.couponCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'ALL'       ? true :
      filterStatus === 'LIVE'      ? c.isActive && !isExpired(c.expiryAt) && !isNotValid(c.validFrom) :
      filterStatus === 'SCHEDULED' ? c.isActive && isNotValid(c.validFrom) :
      filterStatus === 'EXPIRED'   ? isExpired(c.expiryAt) :
      filterStatus === 'INACTIVE'  ? !c.isActive : true;
    return matchSearch && matchStatus;
  });

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = {
    total:     coupons.length,
    live:      coupons.filter(c => c.isActive && !isExpired(c.expiryAt) && !isNotValid(c.validFrom)).length,
    scheduled: coupons.filter(c => c.isActive && isNotValid(c.validFrom)).length,
    expired:   coupons.filter(c => isExpired(c.expiryAt)).length,
    inactive:  coupons.filter(c => !c.isActive).length,
  };

  // ── Form helpers ────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm({ ...defaultForm, validFrom: nowDt() });
    setErrors({});
    setTouched({});
    setModal(true);
  };

  const closeModal = () => { setModal(false); setErrors({}); setTouched({}); };

  const setField = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    // Re-validate this field live
    const next = { ...form, [key]: value };
    const errs = validate(next);
    setErrors(prev => ({ ...prev, [key]: errs[key] }));
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setField('couponCode', code);
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Mark all fields touched
    const allTouched = Object.keys(defaultForm).reduce(
      (acc, k) => ({ ...acc, [k]: true }), {} as Record<keyof CouponFormData, boolean>
    );
    setTouched(allTouched);

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      // Payload matches AddCouponRequestDTO exactly
      const payload = {
        couponCode:            form.couponCode,
        couponType:            form.couponType,
        description:           form.description,
        minOrderAmount:        Number(form.minOrderAmount),
        discountAmount:        Number(form.discountAmount),
        maximumDiscountAmount: Number(form.maximumDiscountAmount),
        expiryAt:              form.expiryAt,              // "yyyy-MM-dd'T'HH:mm"
        validFrom:             form.validFrom,             // "yyyy-MM-dd'T'HH:mm"
        isActive:              form.isActive,
        perUserLimit:          Number(form.perUserLimit),
        globalUsageLimit:      Number(form.globalUsageLimit),
      };

      await couponAPI.create(payload);
      toast.success(`Coupon "${form.couponCode}" created!`);
      closeModal();
      fetchCoupons();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (confirmId === null) return;
    setDeleting(true);
    try {
      await couponAPI.delete(confirmId);
      toast.success('Coupon deleted');
      setConfirmId(null);
      fetchCoupons();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // ── Toggle active ───────────────────────────────────────────────────────
  const handleToggle = async (c: Coupon) => {
    try {
      await couponAPI.update(c.couponId, { isActive: !c.isActive });
      toast.success(`Coupon ${c.isActive ? 'deactivated' : 'activated'}`);
      fetchCoupons();
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ── Input helper for error class ────────────────────────────────────────
  const inputCls = (key: keyof CouponFormData) =>
    cn('input', touched[key] && errors[key] && 'border-red-500 focus:border-red-400 focus:ring-red-400/20');

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">
      <div className="container-wide py-10">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-2">Admin / Coupons</p>
            <h1 className="page-title">Discount Coupons</h1>
            <p className="text-obsidian-500 mt-1.5 text-sm">
              Create and manage promotional discount codes for your store
            </p>
          </div>
          <button className="btn btn-primary gap-2" onClick={openCreate}>
            <Plus size={14} /> New Coupon
          </button>
        </div>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Tag size={16} />}           label="Total"     value={stats.total}     accent />
          <StatCard icon={<Check size={16} />}         label="Live"      value={stats.live}      />
          <StatCard icon={<CalendarDays size={16} />}  label="Scheduled" value={stats.scheduled} />
          <StatCard icon={<TrendingDown size={16} />}  label="Expired"   value={stats.expired}   />
          <StatCard icon={<ToggleLeft size={16} />}    label="Inactive"  value={stats.inactive}  />
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-600" />
            <input
              className="input pl-9"
              placeholder="Search by coupon code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['ALL', 'LIVE', 'SCHEDULED', 'EXPIRED', 'INACTIVE'] as const).map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={cn('btn btn-sm px-3', filterStatus === f ? 'btn-primary' : 'btn-outline')}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────── */}
        {loading ? <LoadingPage /> : filtered.length === 0 ? (
          <EmptyState
            icon={<Tag size={48} strokeWidth={1} className="text-obsidian-700" />}
            title="No coupons found"
            description={search ? `No results for "${search}"` : 'Create your first discount coupon to get started'}
            action={
              <button className="btn btn-primary gap-2" onClick={openCreate}>
                <Plus size={14} /> New Coupon
              </button>
            }
          />
        ) : (
          <>
            <div className="card border-obsidian-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-obsidian-800">
                      {['Code', 'Type', 'Discount', 'Max Cap', 'Min Order', 'Validity', 'Limits', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3.5 text-[10px] tracking-widest uppercase text-obsidian-500 font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.couponId}
                        className="border-b border-obsidian-800/50 hover:bg-obsidian-800/30 transition-colors group">

                        {/* Code */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-semibold text-obsidian-100 tracking-wider">
                              {c.couponCode}
                            </span>
                            <CopyButton code={c.couponCode} />
                          </div>
                          <p className="text-obsidian-600 text-xs mt-0.5 max-w-[160px] truncate">{c.description}</p>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-4">
                          <span className={cn('badge', c.couponType === 'PERCENTAGE' ? 'badge-blue' : 'badge-gold')}>
                            {c.couponType === 'PERCENTAGE'
                              ? <><Percent size={9} className="mr-1" />Percent</>
                              : <><IndianRupee size={9} className="mr-1" />Flat</>
                            }
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="px-4 py-4">
                          <span className="font-display text-gold-400 text-base font-medium">
                            {c.couponType === 'PERCENTAGE'
                              ? `${c.discountAmount}%`
                              : `₹${Number(c.discountAmount).toLocaleString('en-IN')}`
                            }
                          </span>
                        </td>

                        {/* Max cap */}
                        <td className="px-4 py-4 text-obsidian-400 text-xs">
                          ₹{Number(c.maximumDiscountAmount).toLocaleString('en-IN')}
                        </td>

                        {/* Min order */}
                        <td className="px-4 py-4 text-obsidian-400 text-xs">
                          ₹{Number(c.minOrderAmount).toLocaleString('en-IN')}
                        </td>

                        {/* Validity dates */}
                        <td className="px-4 py-4">
                          <div className="text-xs space-y-0.5">
                            <p className="text-obsidian-400">
                              <span className="text-obsidian-600 mr-1">From</span>
                              {fmtDateTime(c.validFrom)}
                            </p>
                            <p className={cn('text-xs', isExpired(c.expiryAt) ? 'text-red-400' : 'text-obsidian-400')}>
                              <span className="text-obsidian-600 mr-1">Until</span>
                              {fmtDateTime(c.expiryAt)}
                            </p>
                          </div>
                        </td>

                        {/* Usage limits */}
                        <td className="px-4 py-4">
                          <div className="text-xs space-y-0.5 text-obsidian-400">
                            <p><Users size={9} className="inline mr-1 text-obsidian-600" />{c.perUserLimit}× per user</p>
                            <p><Globe size={9} className="inline mr-1 text-obsidian-600" />{c.globalUsageLimit} total</p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <CouponStatusBadge coupon={c} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              title={c.isActive ? 'Deactivate' : 'Activate'}
                              className="btn btn-ghost btn-sm px-2"
                              onClick={() => handleToggle(c)}
                            >
                              {c.isActive
                                ? <ToggleRight size={15} className="text-gold-400" />
                                : <ToggleLeft  size={15} className="text-obsidian-500" />
                              }
                            </button>
                            <button
                              className="btn btn-danger btn-sm px-2"
                              onClick={() => setConfirmId(c.couponId)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
           CREATE COUPON MODAL
      ════════════════════════════════════════════════════════════ */}
      <Modal
        open={modal}
        onClose={closeModal}
        title="New Discount Coupon"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary gap-2" onClick={handleSave} disabled={saving}>
              {saving
                ? <><Spinner className="w-4 h-4" /> Creating…</>
                : <><Plus size={14} /> Create Coupon</>
              }
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-5">

          {/* Section: Basic Info */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-obsidian-500 mb-3">Basic Info</p>
            <div className="grid grid-cols-1 gap-4">

              {/* Coupon Code */}
              <Field label="Coupon Code" required error={touched.couponCode ? errors.couponCode : undefined}>
                <div className="flex gap-2">
                  <input
                    className={cn(inputCls('couponCode'), 'font-mono uppercase tracking-widest flex-1')}
                    placeholder="e.g. SAVE20"
                    maxLength={30}
                    value={form.couponCode}
                    onChange={e => setField('couponCode', e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                  />
                  <button type="button" className="btn btn-outline whitespace-nowrap" onClick={generateCode}>
                    Generate
                  </button>
                </div>
              </Field>

              {/* Description */}
              <Field label="Description" required error={touched.description ? errors.description : undefined}>
                <textarea
                  rows={2}
                  className={cn(inputCls('description'), 'resize-none')}
                  placeholder="e.g. Get 20% off on orders above ₹999"
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="divider" />

          {/* Section: Discount Config */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-obsidian-500 mb-3">Discount Configuration</p>
            <div className="flex flex-col gap-4">

              {/* Type toggle */}
              <Field label="Coupon Type" required>
                <TypeToggle value={form.couponType} onChange={v => setField('couponType', v)} />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                {/* Discount Amount */}
                <Field
                  label={form.couponType === 'PERCENTAGE' ? 'Discount (%)' : 'Discount (₹)'}
                  required
                  error={touched.discountAmount ? errors.discountAmount : undefined}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500">
                      {form.couponType === 'PERCENTAGE' ? <Percent size={13} /> : <IndianRupee size={13} />}
                    </span>
                    <input
                      type="number" min="0.01" step="0.01"
                      max={form.couponType === 'PERCENTAGE' ? 100 : undefined}
                      className={cn(inputCls('discountAmount'), 'pl-8')}
                      placeholder={form.couponType === 'PERCENTAGE' ? '20' : '200'}
                      value={form.discountAmount}
                      onChange={e => setField('discountAmount', e.target.value)}
                    />
                  </div>
                </Field>

                {/* Maximum Discount Amount (cap) */}
                <Field
                  label={
                    <span className="flex items-center">
                      Max Discount Cap (₹)
                      <Hint text="Maximum ₹ off a customer can get, even if the percentage discount is higher." />
                    </span> as any
                  }
                  required
                  error={touched.maximumDiscountAmount ? errors.maximumDiscountAmount : undefined}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500">
                      <IndianRupee size={13} />
                    </span>
                    <input
                      type="number" min="0.01" step="0.01"
                      className={cn(inputCls('maximumDiscountAmount'), 'pl-8')}
                      placeholder="500"
                      value={form.maximumDiscountAmount}
                      onChange={e => setField('maximumDiscountAmount', e.target.value)}
                    />
                  </div>
                </Field>

                {/* Min Order Amount */}
                <Field
                  label="Min Order (₹)"
                  required
                  error={touched.minOrderAmount ? errors.minOrderAmount : undefined}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500">
                      <ShoppingCart size={13} />
                    </span>
                    <input
                      type="number" min="0.01" step="0.01"
                      className={cn(inputCls('minOrderAmount'), 'pl-8')}
                      placeholder="999"
                      value={form.minOrderAmount}
                      onChange={e => setField('minOrderAmount', e.target.value)}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Section: Validity */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-obsidian-500 mb-3">Validity Period</p>
            <div className="grid grid-cols-2 gap-4">

              {/* Valid From */}
              <Field label="Valid From" required error={touched.validFrom ? errors.validFrom : undefined}>
                <input
                  type="datetime-local"
                  className={inputCls('validFrom')}
                  value={form.validFrom}
                  onChange={e => setField('validFrom', e.target.value)}
                />
              </Field>

              {/* Expiry At */}
              <Field label="Expires At" required error={touched.expiryAt ? errors.expiryAt : undefined}>
                <div className="flex flex-col gap-2">
                  <input
                    type="datetime-local"
                    className={inputCls('expiryAt')}
                    min={form.validFrom || nowDt()}
                    value={form.expiryAt}
                    onChange={e => setField('expiryAt', e.target.value)}
                  />
                  {/* Quick expiry presets */}
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { label: '+7d',   days: 7   },
                      { label: '+30d',  days: 30  },
                      { label: '+90d',  days: 90  },
                      { label: '+1yr',  days: 365 },
                    ].map(p => (
                      <button key={p.days} type="button"
                        onClick={() => setField('expiryAt', dtPlus(p.days))}
                        className={cn(
                          'btn btn-sm px-2.5 py-1',
                          form.expiryAt === dtPlus(p.days) ? 'btn-primary' : 'btn-ghost'
                        )}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            </div>
          </div>

          <div className="divider" />

          {/* Section: Usage Limits */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-obsidian-500 mb-3">Usage Limits</p>
            <div className="grid grid-cols-2 gap-4">

              {/* Per User Limit */}
              <Field
                label={
                  <span className="flex items-center">
                    Per User Limit
                    <Hint text="How many times a single customer can use this coupon." />
                  </span> as any
                }
                required
                error={touched.perUserLimit ? errors.perUserLimit : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500">
                    <Users size={13} />
                  </span>
                  <input
                    type="number" min="1" step="1"
                    className={cn(inputCls('perUserLimit'), 'pl-8')}
                    placeholder="e.g. 1"
                    value={form.perUserLimit}
                    onChange={e => setField('perUserLimit', e.target.value)}
                  />
                </div>
              </Field>

              {/* Global Usage Limit */}
              <Field
                label={
                  <span className="flex items-center">
                    Global Usage Limit
                    <Hint text="Total number of times this coupon can be redeemed across all customers." />
                  </span> as any
                }
                required
                error={touched.globalUsageLimit ? errors.globalUsageLimit : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500">
                    <Globe size={13} />
                  </span>
                  <input
                    type="number" min="1" step="1"
                    className={cn(inputCls('globalUsageLimit'), 'pl-8')}
                    placeholder="e.g. 500"
                    value={form.globalUsageLimit}
                    onChange={e => setField('globalUsageLimit', e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </div>

          <div className="divider" />

          {/* Section: Activate toggle */}
          <div className="flex items-center justify-between p-4 rounded-sm border border-obsidian-700 bg-obsidian-800/40">
            <div>
              <p className="text-sm font-medium text-obsidian-200">Activate Immediately</p>
              <p className="text-xs text-obsidian-500 mt-0.5">
                Coupon goes live as soon as it's created (if within validity period)
              </p>
            </div>
            <button type="button" onClick={() => setField('isActive', !form.isActive)}
              className="flex items-center gap-2 btn btn-ghost px-2">
              {form.isActive
                ? <ToggleRight size={30} className="text-gold-400" />
                : <ToggleLeft  size={30} className="text-obsidian-600" />
              }
              <span className={cn('text-xs font-medium', form.isActive ? 'text-gold-400' : 'text-obsidian-500')}>
                {form.isActive ? 'Active' : 'Inactive'}
              </span>
            </button>
          </div>

          {/* Live Preview */}
          {(form.couponCode || form.discountAmount) && (
            <div className="rounded-sm border border-gold-400/20 bg-gold-400/5 p-4">
              <p className="text-[10px] tracking-widest uppercase text-gold-400 mb-3 flex items-center gap-1.5">
                <FileText size={11} /> Coupon Preview
              </p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-obsidian-900 border border-dashed border-obsidian-600 rounded-sm px-3 py-2">
                    <span className="font-mono font-bold text-obsidian-100 tracking-widest text-sm">
                      {form.couponCode || '————'}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-gold-400 text-xl font-medium">
                      {form.discountAmount
                        ? form.couponType === 'PERCENTAGE'
                          ? `${form.discountAmount}% OFF`
                          : `₹${Number(form.discountAmount).toLocaleString('en-IN')} OFF`
                        : '— OFF'
                      }
                    </p>
                    {form.maximumDiscountAmount && form.couponType === 'PERCENTAGE' && (
                      <p className="text-obsidian-500 text-xs">
                        up to ₹{Number(form.maximumDiscountAmount).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-obsidian-500 space-y-0.5">
                  {form.minOrderAmount && (
                    <p>Min order ₹{Number(form.minOrderAmount).toLocaleString('en-IN')}</p>
                  )}
                  {form.validFrom && form.expiryAt && (
                    <p>{fmtDateTime(form.validFrom)} → {fmtDateTime(form.expiryAt)}</p>
                  )}
                  {form.perUserLimit && form.globalUsageLimit && (
                    <p>{form.perUserLimit}× / user · {form.globalUsageLimit} total uses</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ── Delete confirm ───────────────────────────────────────── */}
      <Modal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete Coupon"
        maxWidth="max-w-sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setConfirmId(null)}>Cancel</button>
            <button className="btn btn-danger gap-2" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Spinner className="w-4 h-4" /> Deleting…</> : <><Trash2 size={13} /> Delete</>}
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-12 h-12 rounded-sm bg-red-400/10 flex items-center justify-center">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <div>
            <p className="text-obsidian-200 font-medium">This action cannot be undone.</p>
            <p className="text-obsidian-500 text-sm mt-1.5">
              Customers will immediately lose the ability to use this coupon.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddCouponPage;