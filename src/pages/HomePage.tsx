import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'End-to-end encrypted' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return window' },
  { icon: Star, title: 'Premium Quality', desc: 'Curator-approved pieces' },
];

const HomePage: React.FC = () => {

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin/products");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 bg-obsidian-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(228,168,35,0.07)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-grain opacity-30" />

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-[-10%] right-[-10%] h-px"
              style={{
                top: `${10 + i * 14}%`,
                background: 'linear-gradient(90deg, transparent, rgba(228,168,35,0.04), transparent)',
                transform: `rotate(${-8 + i * 2.5}deg)`
              }}
            />
          ))}
        </div>

        <div className="relative container-wide text-center px-4 pt-0">

          <div className="animate-fade-up">

            <p className="text-[10px] tracking-[0.4em] uppercase text-gold-400 mb-6">
              Premium E-Commerce Platform
            </p>

            <h1
              className="font-display font-medium leading-[1.05] mb-8 tracking-tight"
              style={{ fontSize: 'clamp(52px, 10vw, 96px)' }}
            >
              Crafted for
              <br />
              <em className="text-gradient not-italic">Distinction</em>
            </h1>

            <p className="text-obsidian-400 max-w-md mx-auto mb-12 text-base leading-relaxed">
              A thoughtfully curated collection of exceptional products.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">

              <Link to="/products" className="btn btn-primary btn-lg gap-3">
                Explore Collection <ArrowRight size={16} />
              </Link>

              <Link to="/register" className="btn btn-outline btn-lg">
                Join LUXE
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Features */}
      <section className="bg-obsidian-900 border-y border-obsidian-800 py-16">

        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-10">

          {features.map(({ icon: Icon, title, desc }, i) => (

            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >

              <div className="w-11 h-11 border border-obsidian-700 rounded-sm flex items-center justify-center text-gold-400">
                <Icon size={19} />
              </div>

              <div>
                <h3 className="font-display text-base font-medium mb-1">
                  {title}
                </h3>

                <p className="text-obsidian-500 text-xs">
                  {desc}
                </p>
              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default HomePage;