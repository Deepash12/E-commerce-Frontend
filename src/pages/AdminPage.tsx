import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { productAPI } from '../api/services';
import { LoadingPage, Modal, Pagination, Spinner, Field } from '../components/ui';
import { formatPrice, cn } from '../utils';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  subCategory: string;
}

const defaultForm: ProductFormData = { name: '', description: '', price: '', stockQuantity: '', subCategory: '' };

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ pageNumber: page, pageSize: 10 });
      const data = res.data as { content?: Product[]; totalPages?: number };
      setProducts(data.content ?? (res.data as Product[]) ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, product: null }); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), stockQuantity: String(p.stockQuantity), subCategory: String(p.subCategory ?? '') });
    setModal({ open: true, product: p });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: +form.price, stockQuantity: +form.stockQuantity, subcategoryId: form.subCategory ? +form.subCategory : undefined };
      if (modal.product) await productAPI.update(modal.product.id, payload as any);
      else await productAPI.create(payload as any);
      toast.success(modal.product ? 'Product updated' : 'Product created');
      setModal({ open: false, product: null });
      fetchProducts();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const f = (k: keyof ProductFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="page-wrapper">
      <div className="container-wide py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="text-obsidian-500 mt-1">Product Management</p>
          </div>
          <button className="btn btn-primary gap-2" onClick={openCreate}>
            <Plus size={14} /> Add Product
          </button>
        </div>

        {loading ? <LoadingPage /> : (
          <>
            <div className="card border-obsidian-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-obsidian-800">
                      {['ID', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-obsidian-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-obsidian-800/50 hover:bg-obsidian-800/30 transition-colors">
                        <td className="px-4 py-3 text-obsidian-600 font-mono text-xs">#{p.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-obsidian-100">{p.name}</div>
                          <div className="text-obsidian-600 text-xs truncate max-w-[260px]">{p.description}</div>
                        </td>
                        <td className="px-4 py-3 text-obsidian-400 text-xs">{p.categoryName?.name ?? 'No Category'}</td>
                        <td className="px-4 py-3 font-display text-gold-400">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('badge', p.stockQuantity > 0 ? 'badge-green' : 'badge-red')}>
                            {p.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="btn btn-outline btn-sm px-2.5" onClick={() => openEdit(p)}><Edit2 size={12} /></button>
                            <button className="btn btn-danger btn-sm px-2.5" onClick={() => handleDelete(p.id)}><Trash2 size={12} /></button>
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

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, product: null })}
        title={modal.product ? 'Edit Product' : 'New Product'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModal({ open: false, product: null })}>Cancel</button>
            <button className="btn btn-primary gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <><Spinner className="w-4 h-4" /> Saving...</> : 'Save Product'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Product Name" required><input className="input" placeholder="Name" value={form.name} onChange={f('name')} /></Field>
          </div>
          <Field label="Price (INR)" required><input className="input" type="number" placeholder="999" value={form.price} onChange={f('price')} /></Field>
          <Field label="Stock Qty" required><input className="input" type="number" placeholder="100" value={form.stockQuantity} onChange={f('stockQuantity')} /></Field>
          <div className="col-span-2">
            <Field label="Category ID"><input className="input" type="number" placeholder="1" value={form.subCategory} onChange={f('subCategory')} /></Field>
          </div>
          <div className="col-span-2">
            <Field label="Description"><textarea className="input resize-none" rows={3} placeholder="Description..." value={form.description} onChange={f('description')} /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
