// import React from "react";

// export default function HeroSection() {
// return ( <div className="bg-gradient-to-r from-black via-zinc-900 to-black rounded-xl p-10 mb-10 text-white">

//   <h1 className="text-4xl md:text-5xl font-serif mb-4">
//     Discover Premium Devices
//   </h1>

//   <p className="text-gray-400 mb-6 max-w-xl">
//     Explore luxury electronics crafted with performance, elegance and
//     cutting-edge technology.
//   </p>

//   <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
//     Shop Now
//   </button>

// </div>

// );
// }


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";

const HERO_TAGS = ["Premium Quality", "Luxury Design", "Fast Delivery", "Secure Payments"];

const HeroSection: React.FC = () => {
  const [activeTag, setActiveTag] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTag((prev) => (prev + 1) % HERO_TAGS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes tagSlide {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0a0800 0%, #0f0c00 40%, #080808 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.1)",
          padding: "72px 0 64px",
          marginBottom: "0",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px", pointerEvents: "none",
          }}
        />

        {/* Ambient glow blobs */}
        <div
          style={{
            position: "absolute", top: "-120px", left: "20%",
            width: "600px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
            pointerEvents: "none", animation: "heroPulse 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-80px", right: "10%",
            width: "400px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)",
            pointerEvents: "none", animation: "heroPulse 8s ease-in-out infinite 2s",
          }}
        />

        <div className="container-wide" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px", alignItems: "center" }}>

            {/* Left: Text content */}
            <div style={{ maxWidth: "640px" }}>

              {/* Animated tag badge */}
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  marginBottom: "24px", padding: "6px 16px", borderRadius: "100px",
                  background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                  animation: "heroFadeIn 0.5s ease both",
                }}
              >
                <Sparkles size={11} style={{ color: "#d4af37" }} />
                <span
                  key={activeTag}
                  style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "rgba(212,175,55,0.85)",
                    animation: "tagSlide 2s ease both",
                  }}
                >
                  {HERO_TAGS[activeTag]}
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 700,
                  color: "#f0f0f0", lineHeight: 1.05, letterSpacing: "-0.03em",
                  margin: "0 0 20px",
                  animation: "heroFadeIn 0.6s ease 0.1s both",
                }}
              >
                Discover{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #b8861e 0%, #d4af37 40%, #f0d060 70%, #d4af37 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}
                >
                  Premium
                </span>
                <br />
                Devices
              </h1>

              {/* Shimmer divider */}
              <div
                style={{
                  height: "1px", width: "120px", marginBottom: "20px",
                  background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
                  backgroundSize: "200% 100%", animation: "shimmerLine 3s linear infinite",
                }}
              />

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "15px", color: "rgba(255,255,255,0.38)",
                  lineHeight: 1.75, marginBottom: "36px", maxWidth: "460px",
                  animation: "heroFadeIn 0.6s ease 0.2s both",
                }}
              >
                Explore luxury electronics crafted with performance, elegance and cutting-edge technology. Each piece, a statement.
              </p>

              {/* CTAs */}
              <div
                style={{
                  display: "flex", gap: "12px", flexWrap: "wrap",
                  animation: "heroFadeIn 0.6s ease 0.3s both",
                }}
              >
                <Link
                  to="/products"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #c9a227, #d4af37)",
                    color: "#0a0a0a", fontWeight: 700, fontSize: "12.5px",
                    letterSpacing: "0.08em", textDecoration: "none",
                    textTransform: "uppercase", transition: "filter 0.2s ease, transform 0.2s ease",
                    boxShadow: "0 8px 32px rgba(212,175,55,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.1)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.filter = "none";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  }}
                >
                  Shop Now <ArrowRight size={14} strokeWidth={2.5} />
                </Link>

                <Link
                  to="/about"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: "12.5px",
                    letterSpacing: "0.08em", textDecoration: "none",
                    textTransform: "uppercase", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.35)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#d4af37";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  Learn More
                </Link>
              </div>

              {/* Trust signals */}
              <div
                style={{
                  display: "flex", gap: "20px", marginTop: "36px", flexWrap: "wrap",
                  animation: "heroFadeIn 0.6s ease 0.4s both",
                }}
              >
                {[
                  { icon: <ShieldCheck size={13} />, text: "Secure Checkout" },
                  { icon: <Truck size={13} />, text: "Free Shipping ₹999+" },
                  { icon: <Star size={13} />, text: "4.9★ Rated" },
                ].map((item) => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ color: "rgba(212,175,55,0.6)" }}>{item.icon}</span>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating stat cards */}
            <div
              style={{
                display: "none",
                flexDirection: "column", gap: "12px",
                animation: "heroFadeIn 0.8s ease 0.3s both",
              }}
              className="hero-stats"
            >
              {[
                { value: "2,400+", label: "Products" },
                { value: "99%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "16px 24px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.12)",
                    textAlign: "center", backdropFilter: "blur(12px)",
                    animation: `floatBadge ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                  }}
                >
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#d4af37", margin: 0, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: "4px 0 0", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .hero-stats { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default HeroSection;