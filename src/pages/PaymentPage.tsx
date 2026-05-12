import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Banknote, Clock, CheckCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { paymentAPI } from '../api/services';
import { useCart } from '../context/CartContext';
import type { PaymentMethod, Payment } from '../types';
import toast from 'react-hot-toast';

type MethodDef = { id: PaymentMethod; label: string; desc: string; icon: React.ElementType; tag?: string };

const METHODS: MethodDef[] = [
  { id: 'CARD',        label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay',  icon: CreditCard,  tag: 'Popular' },
  { id: 'UPI',         label: 'UPI',                 desc: 'GPay, PhonePe, Paytm',    icon: Smartphone,  tag: 'Instant' },
  { id: 'NET_BANKING', label: 'Net Banking',          desc: 'All major banks',          icon: Building2   },
  { id: 'COD',         label: 'Cash on Delivery',    desc: 'Pay when delivered',       icon: Banknote    },
];

const PaymentPage: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { fetchCart } = useCart();

  const checkoutData  = location.state;
  const numericAmount = Number(checkoutData?.checkoutData?.amount ?? 0);

  const [method,  setMethod]  = useState<PaymentMethod>('UPI');
  const [step,    setStep]    = useState<'select' | 'initiated' | 'success'>('select');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(null);

  const initiate = async () => {
    if (!numericAmount || isNaN(numericAmount)) { toast.error('Invalid amount'); return; }
    setLoading(true);
    try {
      const res = await paymentAPI.initiate({ address: checkoutData.checkoutData.address, amount: numericAmount }, method);
      setPayment(res.data as Payment);
      setStep('initiated');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment initiation failed');
    } finally { setLoading(false); }
  };

  const complete = async () => {
    const pid = payment?.id ?? payment?.paymentId;
    if (!pid) return;
    setLoading(true);
    try {
      await paymentAPI.complete(pid);
      localStorage.removeItem('cart_applied_coupon');
      await fetchCart();
      setStep('success');
      toast.success('Payment successful!');
      setTimeout(() => navigate('/orders'), 2500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  /* ── SUCCESS ── */
  if (step === 'success') return (
    <div style={S.page}>
      <div style={S.glowTop} />
      <div style={{ ...S.card, maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '64px 40px' }}>
        <div style={S.successIcon}>
          <CheckCircle size={40} color="#C9A84C" />
        </div>
        <h1 style={{ ...S.heading, fontSize: 32, marginBottom: 12 }}>Payment Successful</h1>
        <p style={S.subtext}>Your order has been confirmed. Redirecting to orders…</p>
        <div style={S.successBar} />
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.glowTop} />
      <div style={S.glowRight} />

      <div style={S.wrapper}>

        {/* ── Page header ── */}
        <div style={S.pageHeader}>
          <button style={S.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
          <div>
            <p style={S.eyebrow}>SECURE CHECKOUT</p>
            <h1 style={S.heading}>
              Complete <span style={S.gold}>Payment</span>
            </h1>
          </div>
          <div style={S.headerDivider} />
        </div>

        <div style={S.layout}>

          {/* ── LEFT: method / confirm ── */}
          <div style={S.mainCol}>

            {step === 'select' && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>Choose Payment Method</h2>
                <div style={S.methodList}>
                  {METHODS.map(({ id, label, desc, icon: Icon, tag }) => {
                    const active  = method === id;
                    const hovered = hoveredMethod === id;
                    return (
                      <div
                        key={id}
                        onClick={() => setMethod(id)}
                        onMouseEnter={() => setHoveredMethod(id)}
                        onMouseLeave={() => setHoveredMethod(null)}
                        style={{
                          ...S.methodRow,
                          border: active
                            ? '1px solid rgba(201,168,76,0.6)'
                            : hovered
                            ? '1px solid rgba(201,168,76,0.25)'
                            : '1px solid rgba(255,255,255,0.07)',
                          background: active
                            ? 'rgba(201,168,76,0.07)'
                            : hovered
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.02)',
                          boxShadow: active ? '0 0 0 1px rgba(201,168,76,0.1) inset' : 'none',
                        }}
                      >
                        {/* Icon bubble */}
                        <div style={{
                          ...S.iconBubble,
                          background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                          border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <Icon size={17} color={active ? '#C9A84C' : 'rgba(255,255,255,0.35)'} />
                        </div>

                        {/* Label */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ ...S.methodLabel, color: active ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                              {label}
                            </span>
                            {tag && (
                              <span style={{
                                ...S.tag,
                                background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                                color: active ? '#C9A84C' : 'rgba(255,255,255,0.25)',
                                border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.06)',
                              }}>
                                {tag}
                              </span>
                            )}
                          </div>
                          <span style={S.methodDesc}>{desc}</span>
                        </div>

                        {/* Radio */}
                        <div style={{
                          ...S.radio,
                          border: active ? '2px solid #C9A84C' : '2px solid rgba(255,255,255,0.15)',
                          background: active ? '#C9A84C' : 'transparent',
                        }}>
                          {active && <div style={S.radioDot} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={initiate}
                  disabled={loading}
                  style={{ ...S.primaryBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading
                    ? <><span style={S.btnSpinner} /> Processing…</>
                    : `Pay ₹${numericAmount.toLocaleString('en-IN')}`
                  }
                </button>
              </div>
            )}

            {step === 'initiated' && payment && (
              <div style={{ ...S.card, textAlign: 'center', padding: '48px 40px' }}>
                <div style={S.clockIcon}>
                  <Clock size={32} color="#C9A84C" />
                </div>
                <h2 style={{ ...S.cardTitle, textAlign: 'center', marginBottom: 8 }}>Confirm Payment</h2>
                <p style={{ ...S.subtext, marginBottom: 6 }}>
                  Transaction ID:{' '}
                  <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                    {payment.transactionId}
                  </span>
                </p>
                <p style={{ ...S.subtext, fontSize: 11, marginBottom: 36, color: 'rgba(255,255,255,0.2)' }}>
                  This session expires in 15 minutes
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    onClick={complete}
                    disabled={loading}
                    style={{ ...S.primaryBtn, width: 'auto', padding: '13px 32px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? <><span style={S.btnSpinner} /> Processing…</> : 'Complete Payment'}
                  </button>
                  <button onClick={() => navigate('/orders')} style={S.ghostBtn}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: order summary ── */}
          <div style={S.sideCol}>
            <div style={S.summaryCard}>
              <h3 style={S.summaryTitle}>Order Summary</h3>
              <div style={S.summaryDivider} />

              <div style={S.summaryRow}>
                <span style={S.summaryKey}>Subtotal</span>
                <span style={S.summaryVal}>₹{numericAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={S.summaryKey}>Delivery</span>
                <span style={{ ...S.summaryVal, color: '#4ade80', fontSize: 12 }}>Free</span>
              </div>
              <div style={S.summaryDivider} />
              <div style={S.summaryRow}>
                <span style={{ ...S.summaryKey, color: '#fff', fontSize: 14 }}>Total</span>
                <span style={S.totalVal}>₹{numericAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Trust badges */}
              <div style={S.trustBox}>
                <div style={S.trustRow}>
                  <ShieldCheck size={13} color="rgba(201,168,76,0.6)" />
                  <span style={S.trustText}>256-bit SSL encrypted</span>
                </div>
                <div style={S.trustRow}>
                  <ShieldCheck size={13} color="rgba(201,168,76,0.6)" />
                  <span style={S.trustText}>100% secure payments</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes barFill {
          from { width: 0; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#080808',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Georgia', serif",
    paddingBottom: 80,
  },
  glowTop: {
    position: 'absolute',
    top: -160,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 700,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowRight: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  wrapper: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '40px 24px 0',
    position: 'relative',
    zIndex: 1,
  },
  pageHeader: {
    marginBottom: 36,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    marginBottom: 18,
    padding: 0,
    fontFamily: "'Georgia', serif",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: '0.3em',
    color: '#C9A84C',
    marginBottom: 8,
  },
  heading: {
    fontSize: 36,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 14px',
    letterSpacing: '-0.5px',
  },
  gold: {
    color: '#C9A84C',
    fontStyle: 'italic',
  },
  headerDivider: {
    width: 56,
    height: 1,
    background: 'linear-gradient(90deg, #C9A84C, transparent)',
  },
  layout: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
  },
  mainCol: { flex: 1 },
  sideCol: { width: 280, flexShrink: 0 },

  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: 16,
    padding: '32px 28px',
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 24px',
    letterSpacing: '-0.2px',
  },
  methodList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 },
  methodRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.22s ease',
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.22s ease',
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
    transition: 'color 0.2s',
  },
  methodDesc: { fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em' },
  tag: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    padding: '2px 7px',
    borderRadius: 20,
    transition: 'all 0.2s',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#080808',
  },

  primaryBtn: {
    width: '100%',
    padding: '15px 0',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #C9A84C 0%, #a8873d 100%)',
    color: '#080808',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s',
  },
  ghostBtn: {
    padding: '13px 24px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
  },
  btnSpinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(0,0,0,0.25)',
    borderTopColor: '#080808',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  // Summary card
  summaryCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,168,76,0.1)',
    borderRadius: 16,
    padding: '24px 20px',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    margin: '0 0 16px',
  },
  summaryDivider: {
    height: 1,
    background: 'rgba(201,168,76,0.1)',
    margin: '14px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryKey: { fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.03em' },
  summaryVal: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 },
  totalVal: {
    fontSize: 20,
    fontWeight: 700,
    color: '#C9A84C',
    letterSpacing: '-0.5px',
  },
  trustBox: {
    marginTop: 20,
    padding: '14px 12px',
    background: 'rgba(201,168,76,0.04)',
    border: '1px solid rgba(201,168,76,0.1)',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  trustRow: { display: 'flex', alignItems: 'center', gap: 8 },
  trustText: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' },

  // Success
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    animation: 'successPulse 0.6s ease',
  },
  successBar: {
    height: 2,
    background: 'linear-gradient(90deg, #C9A84C, transparent)',
    borderRadius: 2,
    marginTop: 32,
    animation: 'barFill 2.5s ease forwards',
  },
  clockIcon: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: 'rgba(201,168,76,0.07)',
    border: '1px solid rgba(201,168,76,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  subtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.02em',
    margin: '0 0 6px',
    lineHeight: 1.7,
  },
};

export default PaymentPage;