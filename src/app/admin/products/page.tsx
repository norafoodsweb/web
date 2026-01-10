"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// --- TYPES ---
type Product = {
  id?: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  quantity: string; // Packet size (e.g., "500g")
  stock: number;
  shelflife: string;
  ingredients: string;
  description: string;
  image: string;
  bestseller?: boolean;
};

type Category = {
  id: number;
  category: string;
};

const EMPTY_PRODUCT: Product = {
  name: "",
  slug: "",
  category: "",
  price: 0,
  quantity: "",
  stock: 0,
  shelflife: "",
  ingredients: "",
  description: "",
  image: "",
  bestseller: false,
};

export default function ProductsPage() {
  const supabase = createClient();

  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(EMPTY_PRODUCT);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    // 1. Fetch Categories
    const { data: catData } = await supabase.from("category").select("*");
    if (catData) setCategories(catData);

    // 2. Fetch Products
    const { data: prodData } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (prodData) setProducts(prodData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => {
      const newData = {
        ...prev,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      };

      // Auto-generate slug from name if not editing an existing product
      if (name === "name" && !isEditing) {
        newData.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "");
      }
      return newData;
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("productimg")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("productimg")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = currentProduct.image;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
        else throw new Error("Image upload failed");
      }

      const productData = { ...currentProduct, image: imageUrl };

      if (isEditing && currentProduct.id) {
        // UPDATE
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", currentProduct.id);
        if (error) throw error;
      } else {
        // INSERT
        // Remove ID to allow DB to auto-generate it
        const { id, ...newProductData } = productData;
        const { error } = await supabase
          .from("products")
          .insert([newProductData]);
        if (error) throw error;
      }

      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert("Error saving product. Check console for details.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete product.");
    } else {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setCurrentProduct(EMPTY_PRODUCT);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setSelectedFile(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // --- FILTERING ---
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">
            Manage your inventory and catalog
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search products by name, category, or slug..."
          className="flex-grow outline-none text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. PRODUCT TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} /> Loading
                      products...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 w-fit">
                          {product.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Qty: {product.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      ₹{product.price}
                    </td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock > 10 ? (
                          <CheckCircle size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id!)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Row 1: Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Product Name
                  </label>
                  <input
                    required
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="e.g. Kerala Banana Chips"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Slug (URL)
                  </label>
                  <input
                    required
                    name="slug"
                    value={currentProduct.slug}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  />
                </div>
              </div>

              {/* Row 2: Price, Stock, Qty */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Stock
                  </label>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Net Qty
                  </label>
                  <input
                    required
                    name="quantity"
                    value={currentProduct.quantity}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 250g"
                  />
                </div>
              </div>

              {/* Row 3: Category & Shelf Life */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    required
                    name="category"
                    value={currentProduct.category}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Shelf Life
                  </label>
                  <input
                    name="shelflife"
                    value={currentProduct.shelflife}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 6 Months"
                  />
                </div>
              </div>

              {/* Row 4: Ingredients & Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Ingredients
                </label>
                <input
                  name="ingredients"
                  value={currentProduct.ingredients}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Comma separated ingredients..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Detailed product description..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="text-sm text-indigo-600 font-medium">
                        Selected:
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedFile.name}
                      </p>
                    </div>
                  ) : currentProduct.image ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={currentProduct.image}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg mb-2 shadow-sm"
                      />
                      <p className="text-xs text-slate-400">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={32} className="mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="animate-spin" size={18} />}
                  {isEditing ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
