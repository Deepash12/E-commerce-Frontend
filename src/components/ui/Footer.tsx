import { ArrowRight, Shield, RefreshCw, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

      {/* ── Trust Bar ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 0" }}>
        <div
          className="container-wide"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { icon: <Truck size={16} />, label: "Free Shipping", sub: "On orders above ₹499" },
            { icon: <Shield size={16} />, label: "Secure Payments", sub: "100% safe & encrypted" },
            { icon: <RefreshCw size={16} />, label: "Easy Returns", sub: "7-day hassle-free returns" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#d4af37", flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0, marginTop: "1px" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="container-wide" style={{ padding: "56px 0 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
          }}
        >
          {/* Brand Column */}
          <div>
            <Link
              to="/products"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "26px", fontWeight: 700, letterSpacing: "0.2em",
                background: "linear-gradient(135deg, #c9a227, #d4af37, #f0d060)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                textDecoration: "none", display: "inline-block", marginBottom: "16px",
              }}
            >
              LUXE
            </Link>
            <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.35)", marginBottom: "24px", maxWidth: "230px" }}>
              A curated luxury shopping experience. Every product is handpicked for quality, elegance, and distinction.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: "20px" }}>
              Shop
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "All Products", to: "/products" },
                { label: "New Arrivals", to: "/products?sort=newest" },
                { label: "Best Sellers", to: "/products?sort=popular" },
                { label: "Deals & Offers", to: "/products?filter=deals" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: "20px" }}>
              Support
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Help Center", to: "/help" },
                { label: "Shipping Info", to: "/shipping" },
                { label: "Returns", to: "/returns" },
                { label: "Contact Us", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: "20px" }}>
              Stay Updated
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "16px", lineHeight: 1.6 }}>
              Get the latest arrivals and exclusive offers delivered to your inbox.
            </p>

            <div
              style={{
                display: "flex", borderRadius: "10px", overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  padding: "11px 14px", fontSize: "12.5px", color: "#e0e0e0", caretColor: "#d4af37",
                }}
              />
              <button
                style={{
                  padding: "0 16px", background: "linear-gradient(135deg, #c9a227, #d4af37)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#0a0a0a", transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; }}
              >
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ marginTop: "24px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "10px" }}>
                Accepted Payments
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["VISA", "Mastercard", "UPI", "PayPal"].map((method) => (
                  <span
                    key={method}
                    style={{
                      fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em",
                      padding: "4px 10px", borderRadius: "6px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "18px 0" }}>
        <div
          className="container-wide"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", margin: 0 }}>
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                to="#"
                style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.2)"; }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;