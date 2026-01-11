"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Home,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

// --- TYPES ---
type Address = {
  id?: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

const EMPTY_ADDRESS: Address = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

export default function AddressPage() {
  const supabase = createClient();
  const router = useRouter();

  // --- STATE ---
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address>(EMPTY_ADDRESS);

  // --- FETCH DATA ---
  const fetchAddresses = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false }); // Show default first

    if (data) setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // If setting as default, we might need to unset others (optional, depending on DB trigger)
      // For simplicity, we just save here.

      const payload = { ...currentAddress, user_id: user.id };

      if (isEditing && currentAddress.id) {
        // UPDATE
        const { error } = await supabase
          .from("addresses")
          .update(payload)
          .eq("id", currentAddress.id);
        if (error) throw error;
      } else {
        // INSERT
        const { id, ...newAddr } = payload; // Remove undefined ID
        const { error } = await supabase.from("addresses").insert([newAddr]);
        if (error) throw error;
      }

      await fetchAddresses();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to save address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;

    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      alert("Error deleting address");
    } else {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const openAddModal = () => {
    setCurrentAddress(EMPTY_ADDRESS);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setCurrentAddress(addr);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAddress(EMPTY_ADDRESS);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 sm:px-6">
      <Navbar type="customer" />
      <div className="px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Saved Addresses
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href="/profile"
                className="text-stone-500 hover:text-indigo-600 text-sm"
              >
                Profile
              </Link>
              <span className="text-stone-300">/</span>
              <span className="text-stone-500 text-sm">Addresses</span>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        {/* ADDRESS LIST */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">
              No addresses saved
            </h3>
            <p className="text-stone-500 mt-2 mb-6">
              Add an address to make your checkout faster.
            </p>
            <button
              onClick={openAddModal}
              className="text-indigo-600 font-bold hover:underline"
            >
              Add Address Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-xl p-6 border transition-all hover:shadow-md ${
                  addr.is_default
                    ? "border-indigo-500 ring-1 ring-indigo-500"
                    : "border-stone-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-stone-400" />
                    <span className="font-bold text-stone-800">
                      {addr.name}
                    </span>
                    {addr.is_default && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id!)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-stone-600 text-sm mb-4">
                  <p>{addr.address_line1}</p>
                  {addr.address_line2 && <p>{addr.address_line2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-stone-500 pt-4 border-t border-stone-100">
                  <Phone size={14} />
                  <span>{addr.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0">
                <h2 className="text-xl font-bold text-stone-800">
                  {isEditing ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-stone-100 rounded-full"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-stone-500">
                      Full Name
                    </label>
                    <input
                      required
                      name="name"
                      value={currentAddress.name}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-stone-500">
                      Phone
                    </label>
                    <input
                      required
                      name="phone"
                      value={currentAddress.phone}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-500">
                    Address Line 1
                  </label>
                  <input
                    required
                    name="address_line1"
                    value={currentAddress.address_line1}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="House No, Building, Street"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-500">
                    Address Line 2
                  </label>
                  <input
                    name="address_line2"
                    value={currentAddress.address_line2}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Area, Landmark (Optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-stone-500">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      value={currentAddress.city}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-stone-500">
                      State
                    </label>
                    <input
                      required
                      name="state"
                      value={currentAddress.state}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-stone-500">
                      Pincode
                    </label>
                    <input
                      required
                      name="pincode"
                      value={currentAddress.pincode}
                      onChange={handleInputChange}
                      className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="is_default"
                      name="is_default"
                      checked={currentAddress.is_default}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="is_default"
                      className="text-sm text-stone-700"
                    >
                      Set as Default
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving && <Loader2 className="animate-spin" size={18} />}
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
