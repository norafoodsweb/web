"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { createClient } from "@/utils/supabase/client";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Star,
  Save,
  Tags, // Icon for Categories
} from "lucide-react";

// --- TYPES ---
type Product = {
  id?: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  quantity: string;
  stock: number;
  shelflife: string;
  ingredients: string;
  description: string;
  image: string;
  bestseller?: boolean;
};

// New Category Type
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

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  // --- STATES ---
  const [username, setUsername] = useState<string>("Admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State for Categories
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Bestseller State
  const [bestsellerSlots, setBestsellerSlots] = useState<(string | number)[]>([
    "",
    "",
    "",
  ]);
  const [savingBestsellers, setSavingBestsellers] = useState(false);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(EMPTY_PRODUCT);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Category Manager Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          router.replace("/auth");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profile")
          .select("name, role")
          .eq("id", user.id)
          .single();

        if (profileError || !profile || profile.role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/");
          return;
        }

        setUsername(profile.name || "Admin");
        setIsLoadingPage(false);

        // Fetch Data
        await fetchCategories(); // Fetch categories first
        await fetchProducts(); // Then products
      } catch (error) {
        console.error("Security check failed:", error);
        router.replace("/auth");
      }
    };
    checkSessionAndFetch();
  }, [router, supabase]);

  // --- 2. DATA FETCHING ---
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("id", { ascending: true });
    if (data) setCategories(data);
    if (error) console.error("Error fetching categories:", error);
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (data) {
      setProducts(data);
      // Initialize bestsellers
      const currentBestsellers = data
        .filter((p) => p.bestseller)
        .map((p) => p.id!);
      const newSlots = ["", "", ""];
      for (let i = 0; i < 3; i++) {
        if (currentBestsellers[i]) newSlots[i] = currentBestsellers[i];
      }
      setBestsellerSlots(newSlots);
    }
    setLoadingProducts(false);
  };

  // --- 3. CATEGORY CRUD ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);

    const { error } = await supabase
      .from("category")
      .insert([{ category: newCategoryName }]);

    if (error) {
      alert("Error adding category (Name might be duplicate)");
    } else {
      setNewCategoryName(""); // Reset input
      fetchCategories(); // Refresh list
    }
    setIsSavingCategory(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        "Delete this category? Products using it will remain but the label might be lost in future edits."
      )
    )
      return;
    const { error } = await supabase.from("category").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete category");
    }
  };

  // --- 4. PRODUCT CRUD ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => {
      const newData = {
        ...prev,
        // UPDATED: Check for both 'price' AND 'stock' to convert to number
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      };

      if (name === "name" && !isEditing) {
        newData.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "");
      }
      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = currentProduct.image;
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
        else throw new Error("Image upload failed");
      }
      const productData = { ...currentProduct, image: imageUrl };

      if (isEditing && currentProduct.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", currentProduct.id);
        if (error) throw error;
      } else {
        const { id, ...newProductData } = productData;
        const { error } = await supabase
          .from("products")
          .insert([newProductData]);
        if (error) throw error;
      }
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      alert("Error saving product!");
    } finally {
      setIsSaving(false);
    }
  };

  // ... (Keep existing uploadImage, handleDelete, handleSaveBestsellers, handleSlotChange, handleLogout)
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
      console.error(error);
      return null;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter((p) => p.id !== id));
  };

  const handleSlotChange = (index: number, value: string) => {
    const newSlots = [...bestsellerSlots];
    newSlots[index] = value ? Number(value) : "";
    setBestsellerSlots(newSlots);
  };

  const handleSaveBestsellers = async () => {
    setSavingBestsellers(true);
    try {
      await supabase
        .from("products")
        .update({ bestseller: false })
        .neq("id", 0);
      const activeIds = bestsellerSlots.filter((id) => id !== "");
      if (activeIds.length > 0) {
        await supabase
          .from("products")
          .update({ bestseller: true })
          .in("id", activeIds);
      }
      alert("Bestsellers updated!");
      fetchProducts();
    } catch (error) {
      alert("Failed to update bestsellers.");
    } finally {
      setSavingBestsellers(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  // --- OPEN MODALS HELPERS ---
  const openAddModal = () => {
    setCurrentProduct(EMPTY_PRODUCT);
    setSelectedFile(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setSelectedFile(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  if (isLoadingPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Verifying Admin Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between  mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-600">{username}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {/* Manage Categories Button */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              <Tags size={18} /> Categories
            </button>
            {/* Add Product Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>
        </div>

        {/* Bestseller Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            <h2 className="text-lg font-bold text-slate-800">
              Manage Bestsellers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Slot {index + 1}
                </label>
                <select
                  value={bestsellerSlots[index]}
                  onChange={(e) => handleSlotChange(index, e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveBestsellers}
              disabled={savingBestsellers}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {savingBestsellers ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}{" "}
              Save Bestsellers
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Net Qty</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingProducts ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800">
                                {product.name}
                              </p>
                              {product.bestseller && (
                                <Star
                                  size={12}
                                  className="text-yellow-500 fill-yellow-500"
                                />
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        ₹{product.price}
                      </td>
                      {/* --- NEW STOCK COLUMN --- */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} left`
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {product.quantity}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id!)}
                            className="p-2 hover:bg-red-100 rounded-full text-red-600 transition"
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

        <button
          onClick={handleLogout}
          className="fixed bottom-8 right-8 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-lg px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 group z-40"
        >
          Logout
        </button>

        {/* --- CATEGORY MANAGER MODAL --- */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">
                  Manage Categories
                </h2>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-full"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6">
                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-grow border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSavingCategory}
                    className="bg-indigo-600 text-white px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSavingCategory ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Add"
                    )}
                  </button>
                </form>

                {/* Category List */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm">
                      No categories found.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <span className="font-medium text-slate-700">
                          {cat.category}
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ADD/EDIT PRODUCT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-800">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
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
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Masala Chips"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Slug
                    </label>
                    <input
                      required
                      name="slug"
                      value={currentProduct.slug}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. masala-chips"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  {/* --- NEW STOCK INPUT --- */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Stock Count
                    </label>
                    <input
                      required
                      type="number"
                      name="stock"
                      value={currentProduct.stock}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Packet Size
                    </label>
                    <input
                      required
                      type="text"
                      name="quantity"
                      value={currentProduct.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. 100g"
                    />
                  </div>

                  {/* CHANGED: Category is now a dropdown */}
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <label className="text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <select
                      required
                      name="category"
                      value={currentProduct.category}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="">Select...</option>
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
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. 6 Months"
                    />
                  </div>
                </div>
                {/* ... Ingredients, Description, Image Upload ... */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Ingredients
                  </label>
                  <input
                    name="ingredients"
                    value={currentProduct.ingredients}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Comma separated..."
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
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Product details..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition relative">
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
                          alt="Current"
                          className="h-20 w-20 object-cover rounded mb-2 shadow-sm"
                        />
                        <p className="text-xs text-slate-400">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon size={32} className="mb-2" />
                        <p className="text-sm font-medium">Upload image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="animate-spin" size={18} />}
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
