// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// const AddProductPage: React.FC = () => {

//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");
//   const [discountPrice, setDiscountPrice] = useState("");

//   const [categories, setCategories] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);

//   const [categoryId, setCategoryId] = useState("");
//   const [subcategoryId, setSubcategoryId] = useState("");

//   const [image, setImage] = useState<File | null>(null);

//   const token = localStorage.getItem("token");

//   /* ---------------- FETCH CATEGORIES ---------------- */

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/category/view/all?pageNumber=0&pageSize=50`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const data = await res.json();
//       setCategories(data.data.content ?? []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ---------------- FETCH SUBCATEGORIES ---------------- */

//   const fetchSubCategories = async (categoryId: number) => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/sub-category/view/all?pageNumber=0&pageSize=50&categoryId=${categoryId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const data = await res.json();
//       setSubCategories(data.data.content ?? []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ---------------- CATEGORY CHANGE ---------------- */

//   const handleCategoryChange = (e: any) => {
//     const id = e.target.value;

//     setCategoryId(id);
//     setSubcategoryId("");

//     if (id) {
//       fetchSubCategories(Number(id));
//     }
//   };

//   /* ---------------- CREATE PRODUCT ---------------- */

//   const handleCreateProduct = async () => {
//     try {

//       // ✅ VALIDATION
//       if (!name.trim()) {
//         alert("Product name is required");
//         return;
//       }

//       if (!description.trim()) {
//         alert("Description is required");
//         return;
//       }

//       if (!price || Number(price) <= 0) {
//         alert("Enter valid price");
//         return;
//       }

//       if (!stockQuantity || Number(stockQuantity) <= 0) {
//         alert("Enter valid stock quantity");
//         return;
//       }

//       if (!categoryId) {
//         alert("Select category");
//         return;
//       }

//       if (!subcategoryId) {
//         alert("Select subcategory");
//         return;
//       }

//       if (discountPrice && Number(discountPrice) >= Number(price)) {
//         alert("Discount price must be less than price");
//         return;
//       }

//       // ✅ CLEAN DTO
//       const dto = {
//         name: name.trim(),
//         description: description.trim(),
//         price: Number(price),
//         stockQuantity: Number(stockQuantity),
//         categoryId: Number(categoryId),
//         subcategoryId: Number(subcategoryId),
//         discountPrice: discountPrice ? Number(discountPrice) : null
//       };

//       const formData = new FormData();
//       formData.append("dto", JSON.stringify(dto));

//       if (image) {
//         formData.append("image", image);
//       }

//       console.log("DTO:", dto);

//       const res = await fetch(`${BASE_URL}/api/products/add`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!res.ok) {
//         alert("Product creation failed");
//         return;
//       }

//       alert("Product created successfully");

//       // ✅ RESET FORM
//       setName("");
//       setDescription("");
//       setPrice("");
//       setStockQuantity("");
//       setDiscountPrice("");
//       setCategoryId("");
//       setSubcategoryId("");
//       setImage(null);

//       navigate("/admin/products");

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="max-w-xl mx-auto px-6 pt-28 pb-12">

//       <h1 className="text-3xl font-semibold mb-6">
//         Add Product
//       </h1>

//       <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg p-6 space-y-4">

//         {/* NAME */}
//         <input
//           type="text"
//           className="input w-full"
//           placeholder="Product Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         {/* DESCRIPTION */}
//         <textarea
//           className="input w-full"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         {/* PRICE */}
//         <input
//           type="number"
//           className="input w-full"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />

//         {/* DISCOUNT PRICE */}
//         <input
//           type="number"
//           className="input w-full"
//           placeholder="Discount Price"
//           value={discountPrice}
//           onChange={(e) => setDiscountPrice(e.target.value)}
//         />

//         {/* STOCK */}
//         <input
//           type="number"
//           className="input w-full"
//           placeholder="Stock Quantity"
//           value={stockQuantity}
//           onChange={(e) => setStockQuantity(e.target.value)}
//         />

//         {/* CATEGORY */}
//         <select
//           className="input w-full"
//           value={categoryId}
//           onChange={handleCategoryChange}
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* SUBCATEGORY */}
//         <select
//           className="input w-full"
//           value={subcategoryId}
//           onChange={(e) => setSubcategoryId(e.target.value)}
//           disabled={!categoryId}
//         >
//           <option value="">Select SubCategory</option>
//           {subCategories.map((sub) => (
//             <option key={sub.id} value={sub.id}>
//               {sub.name}
//             </option>
//           ))}
//         </select>

//         {/* IMAGE */}
//         <input
//           type="file"
//           className="input w-full"
//           onChange={(e) => {
//             if (e.target.files) {
//               setImage(e.target.files[0]);
//             }
//           }}
//         />

//         {/* SUBMIT */}
//         <button
//           onClick={handleCreateProduct}
//           disabled={
//             !name.trim() ||
//             !description.trim() ||
//             !price ||
//             !stockQuantity ||
//             !categoryId ||
//             !subcategoryId
//           }
//           className="btn btn-primary w-full"
//         >
//           Create Product
//         </button>

//       </div>

//     </div>
//   );
// };

// export default AddProductPage;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/category/view/all?pageNumber=0&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCategories(data.data?.content ?? []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/sub-category/view/all?pageNumber=0&pageSize=50&categoryId=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setSubCategories(data.data?.content ?? []);
    } catch (err) {
      console.error("Subcategory fetch error:", err);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;

    setCategoryId(id);
    setSubcategoryId("");

    if (id) {
      fetchSubCategories(Number(id));
    } else {
      setSubCategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0] || null;

    setImage(selectedImage);

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    if (selectedImage) {
      setPreviewImage(URL.createObjectURL(selectedImage));
    } else {
      setPreviewImage(null);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert("Product name is required");
      return false;
    }

    if (!description.trim()) {
      alert("Description is required");
      return false;
    }

    if (!price || Number(price) <= 0) {
      alert("Enter valid price");
      return false;
    }

    if (!stockQuantity || Number(stockQuantity) < 0) {
      alert("Enter valid stock quantity");
      return false;
    }

    if (!categoryId) {
      alert("Select category");
      return false;
    }

    if (!subcategoryId) {
      alert("Select subcategory");
      return false;
    }

    if (discountPrice && Number(discountPrice) >= Number(price)) {
      alert("Discount price must be less than price");
      return false;
    }

    return true;
  };

  const handleCreateProduct = async () => {
    try {
      if (!validateForm()) return;

      const dto = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        discountPrice: discountPrice ? Number(discountPrice) : null,
      };

      const formData = new FormData();

      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], {
          type: "application/json",
        })
      );

      if (image) {
        formData.append("image", image);
      }

      console.log("Create product DTO:", dto);

      const res = await fetch(`${BASE_URL}/api/products/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Product creation failed response:", errorText);
        alert("Product creation failed");
        return;
      }

      alert("Product created successfully");

      setName("");
      setDescription("");
      setPrice("");
      setStockQuantity("");
      setDiscountPrice("");
      setCategoryId("");
      setSubcategoryId("");
      setImage(null);
      setPreviewImage(null);

      navigate("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);
      alert("Product creation failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-6 pt-28 pb-12">
      <h1 className="text-3xl font-semibold mb-6">
        Add Product
      </h1>

      <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg p-6 space-y-4">
        <input
          type="text"
          className="input w-full"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="input w-full"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className="input w-full"
          placeholder="Discount Price"
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
        />

        <input
          type="number"
          className="input w-full"
          placeholder="Stock Quantity"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />

        <select
          className="input w-full"
          value={categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="input w-full"
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          disabled={!categoryId}
        >
          <option value="">Select SubCategory</option>

          {subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        {previewImage && (
          <div className="w-full h-40 border border-gray-700 rounded bg-black flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain rounded"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="input w-full"
          onChange={handleImageChange}
        />

        <button
          onClick={handleCreateProduct}
          disabled={
            !name.trim() ||
            !description.trim() ||
            !price ||
            !stockQuantity ||
            !categoryId ||
            !subcategoryId
          }
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Product
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;