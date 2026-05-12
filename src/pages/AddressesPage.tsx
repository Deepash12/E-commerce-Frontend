import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Pencil } from 'lucide-react';
import { addressAPI } from '../api/service';
import { useNavigate } from 'react-router-dom';
import { LoadingPage, EmptyState } from '../components/ui';
import AddressForm from '../components/address/AddressForm';
import type { Address } from '../types';
import toast from 'react-hot-toast';

const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const navigate = useNavigate();
  const fetchAddresses = async () => {
    try {
      const res = await addressAPI.view();
      setAddresses(res.data.data ?? []);   // 🔥 THIS IS THE FIX
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressAPI.delete(id);
      toast.success('Address removed');
      fetchAddresses();
    } catch { toast.error('Failed to delete address'); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="pt-[20px] min-h-screen">
      <div className="container-wide max-w-2xl ">
        <div className="flex items-center justify-between mb-8 ">
          <div>
            <h3 className="page-title">My-Address</h3>
            <p className="text-obsidian-500 mt-2">{addresses.length}/5 saved</p>
          </div>
          {addresses.length < 5 && (
            <button className="btn btn-primary gap-2 " onClick={() => setShowForm(!showForm)}>
              <Plus size={14} /> Add Address
            </button>
          )}
        </div>

        {showForm && (
          <div className="card border-obsidian-700 p-6 mb-6 animate-fade-up">
            <h2 className="section-title mb-5">New Address</h2>
            <AddressForm
              initialData={editingAddress}
              onSuccess={() => {
                setShowForm(false);
                setEditingAddress(null);
                fetchAddresses();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
            />
          </div>
        )}

        {addresses.length === 0 ? (
          <EmptyState
            icon={<MapPin size={52} />}
            title="No addresses saved"
            description="Add a delivery address to get started"
            action={<button className="btn btn-primary gap-2" onClick={() => setShowForm(true)}><Plus size={14} /> Add Address</button>}
          />
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="card border-obsidian-800 p-5 flex gap-4 items-start hover:border-obsidian-700 transition-colors animate-fade-up">
                <MapPin size={18} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-sm">{addr.fullName}</span>
                    {addr.isDefault && <span className="badge badge-gold">Default</span>}
                  </div>
                  <p className="text-obsidian-500 text-xs leading-relaxed">
                    {addr.addressLine1}{addr.landmark ? `, ${addr.landmark}` : ''}<br />
                    {addr.city}, {addr.state} — {addr.postalCode}<br />
                    {addr.country} · {addr.phone}
                  </p>
                </div>
                {/* <button
                  className="text-obsidian-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 size={15} />
                </button> */}

                <button
                  className="text-obsidian-600 hover:text-blue-400 transition-colors p-1"
                  onClick={() => {
                    setEditingAddress(addr);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={15} />
                </button>

                <button
                  className="text-obsidian-600 hover:text-red-400 transition-colors p-1"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
