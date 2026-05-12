import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productAPI } from "@/api/services";
interface Category {
  ID: number;
  name: string;
  Description: string;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  brand: string;
  categoryName: Category;
  subCategoryName: SubCategory;
  productImageUrl: string;
  status: string;
  createdAt: string;
}

const ViewProductPage: React.FC = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [Product, setProduct] = useState<Product | null>(null);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getById(Number(id));
      setProduct(res.data as unknown as Product);
    } catch (err) {
      console.error("Failed to fetch product", err);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (!Product) return <div className="text-center pt-40">Loading...</div>;

  return (

    <div className="flex justify-center pt-28 pb-16">

      <div className="w-full max-w-5xl bg-[#141414] border border-gray-800 rounded-xl shadow-xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold text-yellow-400">
            {Product.name}
          </h1>

          <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            {Product.status}
          </span>

        </div>

        <div className="grid grid-cols-2 gap-10">

          {/* Product Image */}
          <div className="flex justify-center">

            <img
              src={`http://localhost:8080${Product.productImageUrl}`}

              alt={Product.name}
              className="rounded-lg border border-gray-700 w-80 object-cover"
            />

          </div>


          {/* Product Details */}
          <div className="space-y-5">



            <div>
              <p className="text-gray-400">Category</p>
              <p className="font-semibold">{Product.categoryName?.name}</p>
            </div>


            <div>
              <p className="text-gray-400">Sub-Category</p>
              <p className="font-semibold">{Product.subCategoryName?.name}</p>
            </div>

            <div>
              <p className="text-gray-400">Price</p>
              <p className="text-lg font-bold">₹{Product.price}</p>
            </div>

            <div>
              <p className="text-gray-400">Discount Price</p>
              <p className="text-green-400 text-lg font-bold">
                ₹{Product.discountPrice || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Stock</p>
              <p className="font-semibold">{Product.stockQuantity}</p>
            </div>

            <div>
              <p className="font-semibold">
                {Product.createdAt
                  ? new Date(Product.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

          </div>

        </div>

        {/* Description */}
        <div className="border-t border-gray-800 mt-10 pt-6">

          <h2 className="text-lg font-semibold mb-3">
            Product Description
          </h2>

          <p className="text-gray-300 leading-relaxed">
            {Product.description}
          </p>

        </div>

        {/* Buttons */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex justify-between">

          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Back
          </button>

          <Link
            to={`/admin/products/edit/${Product.id}`}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Edit Product
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ViewProductPage;