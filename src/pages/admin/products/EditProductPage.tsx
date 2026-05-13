// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const EditProductPage: React.FC = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [discountPrice, setDiscountPrice] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");
//   const [subcategoryId, setSubcategoryId] = useState("");
//   const [categoryId, setCategoryId] = useState("");

//   const [categories, setCategories] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);

//   const [image, setImage] = useState<File | null>(null);
//   const [existingImage, setExistingImage] = useState<string | null>(null);


//   const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//   const token = localStorage.getItem("token");

//   /* ---------------- FETCH CATEGORIES ---------------- */

//   const fetchCategories = async () => {

//     const res = await fetch(
//       `${BASE_URL}/api/category/view/all?pageNumber=0&pageSize=50`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const response = await res.json();
//     setCategories(response.data?.content ?? []);
//   };

//   /* ---------------- FETCH SUBCATEGORIES ---------------- */

//   const fetchSubCategories = async (categoryId: number) => {

//     const res = await fetch(
//       `${BASE_URL}/api/sub-category/view/all?pageNumber=0&pageSize=50&categoryId=${categoryId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const response = await res.json();
//     setSubCategories(response.data?.content ?? []);
//   };

//   /* ---------------- FETCH PRODUCT ---------------- */

//   const fetchProduct = async () => {

//     try {

//       const res = await fetch(`${BASE_URL}/api/products/view/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const response = await res.json();
//       const data = response.data ?? response;

//       setName(data.name ?? "");
//       setDescription(data.description ?? "");
//       setPrice(data.price ? data.price.toString() : "");
//       setDiscountPrice(data.discountPrice ? data.discountPrice.toString() : "");
//       setStockQuantity(data.stockQuantity ? data.stockQuantity.toString() : "");

//       const catId = data.categoryName?.id;
//       const subId = data.subCategoryName?.id;

//       if (catId) {

//         setCategoryId(catId.toString());

//         await fetchSubCategories(catId);

//         if (subId) {
//           setSubcategoryId(subId.toString());
//         }
//       }

//       if (data.productImageUrl) {
//         setExistingImage(`${BASE_URL}${data.productImageUrl}`);
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ---------------- CATEGORY CHANGE ---------------- */

//   const handleCategoryChange = async (value: string) => {

//     setCategoryId(value);
//     setSubcategoryId("");

//     if (value) {
//       await fetchSubCategories(Number(value));
//     }
//   };

//   /* ---------------- EXISTING IMAGE TO FILE ---------------- */

//   const getExistingImageFile = async () => {

//     if (!existingImage) return null;

//     const response = await fetch(existingImage);
//     const blob = await response.blob();

//     return new File([blob], "existing-image.jpg", {
//       type: blob.type
//     });
//   };

//   /* ---------------- UPDATE PRODUCT ---------------- */

//   const handleUpdateProduct = async () => {

//     try {

//       const dto = {
//         name,
//         description,
//         price: Number(price),
//         discountPrice: Number(discountPrice),
//         stockQuantity: Number(stockQuantity),
//         subcategoryId: Number(subcategoryId),
//         categoryId: Number(categoryId)
//       };

//       const formData = new FormData();

//       formData.append(
//         "dto",
//         new Blob([JSON.stringify(dto)], { type: "application/json" })
//       );

//       if (image) {

//         formData.append("image", image);

//       } else if (existingImage) {

//         const oldImageFile = await getExistingImageFile();

//         if (oldImageFile) {
//           formData.append("image", oldImageFile);
//         }
//       }

//       const res = await fetch(`${BASE_URL}/api/products/edit/${id}`, {

//         method: "PUT",

//         headers: {
//           Authorization: `Bearer ${token}`
//         },

//         body: formData
//       });

//       if (!res.ok) {
//         throw new Error("Update failed");
//       }

//       alert("Product updated successfully");

//       navigate("/admin/products");

//     } catch (err) {

//       console.error("Error updating product", err);
//     }
//   };

//   /* ---------------- REMOVE IMAGE ---------------- */

//   const removeImage = () => {

//     setExistingImage(null);
//     setImage(null);
//   };

//   /* ---------------- USE EFFECT ---------------- */

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   /* ---------------- UI ---------------- */

//   return (

//     <div className="max-w-xl mx-auto px-6 pt-28 pb-12">

//       <h1 className="text-3xl font-semibold mb-6">
//         Edit Product
//       </h1>

//       <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg p-6 space-y-4">

//         <input
//           type="text"
//           className="input w-full"
//           placeholder="Product Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <textarea
//           className="input w-full"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

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
//           onChange={(e) => handleCategoryChange(e.target.value)}
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

//         {/* EXISTING IMAGE */}

//         {existingImage && (

//           <div className="relative">

//             <img
//               src={existingImage}
//               alt="product"
//               className="w-full h-40 object-contain border rounded"
//             />

//             <button
//               onClick={removeImage}
//               className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
//             >
//               ❌
//             </button>

//           </div>
//         )}

//         {/* NEW IMAGE */}

//         <input
//           type="file"
//           className="input w-full"
//           onChange={(e) =>
//             setImage(e.target.files ? e.target.files[0] : null)
//           }
//         />

//         <button
//           onClick={handleUpdateProduct}
//           className="btn btn-primary w-full"
//         >
//           Update Product
//         </button>

//       </div>

//     </div>
//   );
// };

// export default EditProductPage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (url?: string | null) => {
  if (!url) return null;

  const cleanUrl = url.trim();

  if (!cleanUrl || cleanUrl === "null" || cleanUrl === "undefined") {
    return null;
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `${BASE_URL}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
};

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

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

      const response = await res.json();
      setCategories(response.data?.content ?? []);
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

      const response = await res.json();
      setSubCategories(response.data?.content ?? []);
    } catch (err) {
      console.error("Subcategory fetch error:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/view/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();
      const data = response.data ?? response;

      console.log("Edit product response:", data);
      console.log("Product image from API:", data?.productImageUrl);
      console.log("Final product image:", getImageUrl(data?.productImageUrl));

      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setPrice(data.price ? data.price.toString() : "");
      setDiscountPrice(data.discountPrice ? data.discountPrice.toString() : "");
      setStockQuantity(data.stockQuantity ? data.stockQuantity.toString() : "");

      const catId = data.categoryName?.id;
      const subId = data.subCategoryName?.id;

      if (catId) {
        setCategoryId(catId.toString());
        await fetchSubCategories(catId);

        if (subId) {
          setSubcategoryId(subId.toString());
        }
      }

      setExistingImage(data.productImageUrl || null);
      setPreviewImage(null);
      setImage(null);
      setRemoveExistingImage(false);
      setImageError(false);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  const handleCategoryChange = async (value: string) => {
    setCategoryId(value);
    setSubcategoryId("");

    if (value) {
      await fetchSubCategories(Number(value));
    } else {
      setSubCategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0] || null;

    setImage(selectedImage);
    setRemoveExistingImage(false);
    setImageError(false);

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    if (selectedImage) {
      setPreviewImage(URL.createObjectURL(selectedImage));
    } else {
      setPreviewImage(null);
    }
  };

  const removeImage = () => {
    setExistingImage(null);
    setPreviewImage(null);
    setImage(null);
    setRemoveExistingImage(true);
    setImageError(false);
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

  const handleUpdateProduct = async () => {
    try {
      if (!validateForm()) return;

      const dto = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stockQuantity: Number(stockQuantity),
        subcategoryId: Number(subcategoryId),
        categoryId: Number(categoryId),
        removeImage: removeExistingImage,
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

      const res = await fetch(`${BASE_URL}/api/products/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update failed response:", errorText);
        throw new Error("Update failed");
      }

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product", err);
      alert("Product update failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const existingImageSrc = getImageUrl(existingImage);
  const displayImage = previewImage || existingImageSrc;

  return (
    <div className="max-w-xl mx-auto px-6 pt-28 pb-12">
      <h1 className="text-3xl font-semibold mb-6">
        Edit Product
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
          onChange={(e) => handleCategoryChange(e.target.value)}
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

        {displayImage && !imageError ? (
          <div className="relative">
            <img
              src={displayImage}
              alt="product"
              className="w-full h-40 object-contain border border-gray-700 rounded bg-black"
              onLoad={() => console.log("Edit image loaded:", displayImage)}
              onError={(e) => {
                console.log("Edit image failed:", e.currentTarget.src);
                setImageError(true);
              }}
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </div>
        ) : (
          <div className="w-full h-40 border border-gray-700 rounded flex items-center justify-center text-gray-400 bg-gray-800">
            No Image
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="input w-full"
          onChange={handleImageChange}
        />

        <button
          onClick={handleUpdateProduct}
          className="btn btn-primary w-full"
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProductPage;