import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AboutPage = () => {

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin/products");
    }
  }, [isAdmin, navigate]);

  const [customers, setCustomers] = useState(0);
  const [products, setProducts] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {

    const animate = (setter:any, target:number) => {

      let start = 0;

      const interval = setInterval(() => {

        start += Math.ceil(target / 50);

        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(start);
        }

      }, 30);

    };

    animate(setCustomers, 10000);
    animate(setProducts, 500);
    animate(setCountries, 30);

  }, []);

  return (
    <div className="bg-obsidian-950 text-white">

      <section
        className="h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8)"
        }}
      >

        <div className="bg-black/60 w-full h-full flex flex-col justify-center items-center px-6">

          <h1 className="text-6xl text-gold-400 font-display mb-6">
            Our Story
          </h1>

          <p className="max-w-xl text-lg text-gray-300">
            LUXE is built for those who value elegance, craftsmanship,
            and timeless luxury.
          </p>

        </div>

      </section>

      <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
          className="rounded-xl shadow-xl"
        />

        <div>

          <h2 className="text-3xl text-gold-400 mb-6">
            Crafted With Passion
          </h2>

          <p className="text-gray-300 mb-4">
            LUXE started with a vision to redefine luxury e-commerce.
          </p>

          <p className="text-gray-300">
            Every item represents elegance and craftsmanship.
          </p>

        </div>

      </section>

      <section className="py-24 border-t border-obsidian-800 text-center">

        <h2 className="text-4xl text-gold-400 mb-6">
          Experience Luxury Shopping
        </h2>

        <p className="text-gray-300 mb-10">
          Discover our premium collection.
        </p>

        <Link
          to="/products"
          className="px-10 py-3 bg-gold-400 text-black rounded-md font-semibold hover:bg-gold-500 transition"
        >
          Explore Products
        </Link>

      </section>

    </div>
  );
};

export default AboutPage;