"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, Star, AlertCircle, LayoutTemplate } from "lucide-react";

// --- TYPES ---
type Product = {
  id: number; // Assuming ID is number based on previous context
  name: string;
  bestseller: boolean;
};

export default function SettingsPage() {
  const supabase = createClient();

  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // We track 3 slots for the homepage
  const [bestsellerSlots, setBestsellerSlots] = useState<(number | "")[]>([
    "",
    "",
    "",
  ]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, bestseller")
        .order("name");

      if (data) {
        setProducts(data);

        // Pre-fill slots with existing bestsellers (limit to 3)
        const currentBestsellers = data
          .filter((p) => p.bestseller)
          .map((p) => p.id);

        const newSlots: (number | "")[] = ["", "", ""];
        currentBestsellers.forEach((id, index) => {
          if (index < 3) newSlots[index] = id;
        });
        setBestsellerSlots(newSlots);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // --- HANDLERS ---
  const handleSlotChange = (index: number, value: string) => {
    const newSlots = [...bestsellerSlots];
    newSlots[index] = value ? Number(value) : "";
    setBestsellerSlots(newSlots);
  };

  const handleSaveBestsellers = async () => {
    setSaving(true);
    try {
      // 1. Reset ALL products to not be bestsellers
      // Note: This is safer than trying to diff the changes
      await supabase
        .from("products")
        .update({ bestseller: false })
        .neq("id", 0); // Hacky way to select all, or iterate if needed

      // 2. Set new bestsellers
      const activeIds = bestsellerSlots.filter((id) => id !== "") as number[];

      if (activeIds.length > 0) {
        const { error } = await supabase
          .from("products")
          .update({ bestseller: true })
          .in("id", activeIds);

        if (error) throw error;
      }

      alert("Storefront updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update bestsellers.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* 1. PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">
          Configure your storefront appearance
        </p>
      </div>

      <div className="max-w-2xl">
        {/* 2. BESTSELLER CONFIGURATION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <LayoutTemplate className="text-indigo-600" size={20} />
            <h2 className="font-bold text-slate-800">Homepage Bestsellers</h2>
          </div>

          <div className="p-6">
            <div className="flex gap-3 mb-6 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm border border-indigo-100">
              <Star
                className="fill-indigo-600 text-indigo-600 shrink-0"
                size={18}
              />
              <p>
                Select up to 3 products to highlight on your homepage. These
                will appear in the "Bestsellers" section.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {bestsellerSlots.map((slotId, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <label className="col-span-3 text-sm font-bold text-slate-600 uppercase tracking-wide">
                      Slot #{index + 1}
                    </label>
                    <div className="col-span-9">
                      <select
                        value={slotId}
                        onChange={(e) =>
                          handleSlotChange(index, e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      >
                        <option value="">-- Empty Slot --</option>
                        {products.map((p) => (
                          <option
                            key={p.id}
                            value={p.id}
                            // Disable option if selected in another slot (optional UX improvement)
                            disabled={
                              bestsellerSlots.includes(p.id) && slotId !== p.id
                            }
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveBestsellers}
                disabled={saving || loading}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* 3. FUTURE SETTINGS PLACEHOLDERS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-60">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <AlertCircle className="text-slate-400" size={20} />
            <h2 className="font-bold text-slate-600">
              General Information (Coming Soon)
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-400">
              Future updates will allow you to edit your store name, contact
              email, and currency settings here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
