import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../../../api/service";
import { Pagination } from "antd";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  productImageUrl: string | null;
  discountPrice: number;
  categoryName: CategoryName;
  subCategoryName: SubCategoryName;
  isActive: boolean;
}

interface CategoryName {
  id: number;
  name: string;
  description: string;
}

interface SubCategoryName {
  category: CategoryName;
  id: number;
  name: string;
  description: string;
}

const ProductListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (page = currentPage, size = pageSize) => {
    try {
      const token = localStorage.getItem("token");

      const res = await productAPI.viewAll(
        {
          pageNumber: page - 1,
          pageSize: size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = res.data;

      if (response?.data?.content) {
        setProducts(response.data.content);
        setTotal(response.data.totalElements);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enable / Disable Product
  const toggleProductStatus = async (id: number, currentFlag: boolean) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${BASE_URL}/api/products/enable-disable/${id}?flag=${!currentFlag}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold">Admin Products</h1>

        <Link
          to="/admin/products/add"
          className="px-5 py-2.5 bg-gold-400 text-black rounded-md font-medium hover:bg-gold-300"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No products found
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-obsidian-800 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">SubCategory</th>
                    <th className="px-6 py-3">Discount</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-obsidian-700 hover:bg-obsidian-800 transition"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        {p.productImageUrl ? (
                          <img
                            src={`${BASE_URL}${p.productImageUrl}`}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-700 rounded flex items-center justify-center text-xs">
                            No Img
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/products/view/${p.id}`}
                          className="font-medium text-gold-400 hover:underline"
                        >
                          {p.name}
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        {p.categoryName?.name || "No Category"}
                      </td>

                      {/* SubCategory */}
                      <td className="px-6 py-4">
                        {p.subCategoryName?.name || "No SubCategory"}
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">{p.discountPrice}</td>

                      {/* Price */}
                      <td className="px-6 py-4">₹{p.price}</td>

                      {/* Stock */}
                      <td className="px-6 py-4">{p.stockQuantity}</td>

                      {/* Status Toggle */}
                      <td className="px-6 py-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={p.isActive}
                            onChange={() =>
                              toggleProductStatus(p.id, p.isActive)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 relative transition">
                            <div className="absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-full"></div>
                          </div>
                        </label>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 space-x-2 text-center">
                        <Link
                          to={`/admin/products/view/${p.id}`}
                          className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                          View
                        </Link>

                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end p-4 border-t border-obsidian-700">
              <Pagination
              defaultPageSize={5}
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["5", "10", "20", "50"]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;