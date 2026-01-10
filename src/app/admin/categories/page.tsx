"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, Tags, AlertCircle } from "lucide-react";

// --- TYPES ---
type Category = {
  id: number;
  category: string;
};

export default function CategoriesPage() {
  const supabase = createClient();

  // --- STATE ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- FETCH DATA ---
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- HANDLERS ---

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSaving(true);

    // Check for duplicates locally first to save an API call
    if (
      categories.some(
        (c) => c.category.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      alert("This category already exists!");
      setIsSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("category")
        .insert([{ category: newCategoryName.trim() }])
        .select()
        .single();

      if (error) throw error;

      // Optimistic update (or just push the returned data)
      if (data) {
        setCategories([...categories, data]);
        setNewCategoryName("");
      }
    } catch (error) {
      alert("Failed to add category. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm("Are you sure? This might affect products using this category.")
    )
      return;

    // Optional: Check if products depend on this category before deleting
    // For now, we just delete.
    try {
      const { error } = await supabase.from("category").delete().eq("id", id);

      if (error) throw error;

      // Remove from UI immediately
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert("Failed to delete category.");
      console.error(error);
    }
  };

  return (
    <div>
      {/* 1. PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
        <p className="text-slate-500 mt-1">
          Organize your products into sections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* 2. ADD CATEGORY FORM (Left Column) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-1 sticky top-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" /> Add New
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Snacks"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !newCategoryName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Save Category"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex gap-2 items-start">
              <AlertCircle
                size={16}
                className="text-indigo-600 mt-0.5 shrink-0"
              />
              <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>Tip:</strong> Keep category names short and clear. These
                will appear in your shop filters and product details.
              </p>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY LIST (Right Column) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 md:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">All Categories</h3>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
              {categories.length} Total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Loader2 className="animate-spin mb-2" size={24} />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Tags className="text-slate-300 mb-2" size={48} />
                <p>No categories found.</p>
                <p className="text-sm">Create your first one on the left.</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Tags size={18} />
                    </div>
                    <span className="font-medium text-slate-800 text-base">
                      {cat.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Placeholder for Edit button if you want to add renaming later */}

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
