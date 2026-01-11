"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/app/context/CartContext";
import {
  CheckCircle,
  MapPin,
  Plus,
  Loader2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

// --- Types ---
type Address = {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();

  // Cart Store
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Local State
  const [step, setStep] = useState(1); // 1: Address, 2: Summary (Final)
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  // New Address Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 1. Fetch User Addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?next=/checkout");
        return;
      }

      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (data) {
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      }
      setLoading(false);
    };

    fetchAddresses();
  }, [supabase, router]);

  // 2. Handle Address Saving
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert([{ ...newAddress, user_id: user.id }])
      .select()
      .single();

    if (error) {
      alert("Error saving address");
    } else if (data) {
      setAddresses([...addresses, data]);
      setSelectedAddressId(data.id);
      setIsAddingNew(false);
    }
    setLoading(false);
  };

  // 3. Generate WhatsApp Message
  const generateWhatsAppMessage = (orderId: number, address: Address) => {
    const total = getTotalPrice();

    let itemList = "";
    items.forEach((item, index) => {
      itemList += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${
        item.price * item.quantity
      }\n`;
    });

    return `*New Order Request - Nora Foods* ⫷⫸
Order ID: #${orderId}
--------------------------------
*Customer Details:*
→ ${address.name}
→ ${address.phone}
→ ${address.address_line1}, ${address.city}, ${address.pincode}
--------------------------------
*Items:*
${itemList}
--------------------------------
*Item Total:* ₹${total}
*Delivery:* To be calculated (₹70/kg)
--------------------------------
*Payment:* To be discussed on chat`;
  };

  // 4. Handle Order Creation & WhatsApp Redirect
  const handlePlaceOrder = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !selectedAddressId) return;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) return;

    const totalAmount = getTotalPrice();

    try {
      // A. Decrement Stock
      const stockUpdateData = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const { error: stockError } = await supabase.rpc("decrement_stock", {
        order_items: stockUpdateData,
      });

      if (stockError)
        throw new Error("Some items are out of stock. Please refresh cart.");

      // B. Create Order in DB
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total_amount: totalAmount,
          payment_status: "pending", // Pending until confirmed on WA
          shipping_address: selectedAddr,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // C. Create Order Items
      const orderItemsData = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);
      if (itemsError) throw itemsError;

      // D. Success! Redirect to WhatsApp
      const message = generateWhatsAppMessage(orderData.id, selectedAddr);
      const whatsappUrl = `https://wa.me/917306874286?text=${encodeURIComponent(
        message
      )}`;

      clearCart();
      window.open(whatsappUrl, "_blank"); // Open WhatsApp
      router.push("/profile/orders"); // Redirect user to orders page
    } catch (error: any) {
      console.error(error);
      alert("Order failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1 && addresses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nora-beige">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nora-beige py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps (Simplified) */}
        <div className="flex justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-primary font-bold" : "text-stone-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= 1 ? "bg-primary text-white" : "bg-stone-200"
              }`}
            >
              1
            </div>
            Address
          </div>
          <div className="w-16 h-[2px] bg-stone-200 self-center"></div>
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-primary font-bold" : "text-stone-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= 2 ? "bg-primary text-white" : "bg-stone-200"
              }`}
            >
              2
            </div>
            Confirm
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-6 sm:p-8 min-h-[400px]">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2 text-primary">
                <MapPin className="text-secondary" /> Select Delivery Address
              </h2>

              {!isAddingNew ? (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all group ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-stone-100 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddressId === addr.id
                              ? "border-primary"
                              : "border-stone-300"
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-stone-800 text-lg">
                            {addr.name}
                          </p>
                          <p className="text-stone-600">
                            {addr.address_line1}, {addr.address_line2}
                          </p>
                          <p className="text-stone-600">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-primary font-medium text-sm mt-2 flex items-center gap-1">
                            <Truck size={14} /> {addr.phone}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="address"
                        className="hidden"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                    </label>
                  ))}

                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add New Address
                  </button>

                  <div className="flex justify-end mt-8">
                    <button
                      disabled={!selectedAddressId}
                      onClick={() => setStep(2)}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#3d5635] transition-colors flex items-center gap-2 shadow-md"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Add New Address Form */
                <form
                  onSubmit={handleSaveAddress}
                  className="space-y-4 max-w-lg mx-auto"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Full Name"
                      className="border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                    />
                    <input
                      required
                      placeholder="Phone Number"
                      className="border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                    />
                  </div>
                  <input
                    required
                    placeholder="Address Line 1"
                    className="w-full border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newAddress.address_line1}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        address_line1: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Address Line 2 (Optional)"
                    className="w-full border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newAddress.address_line2}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        address_line2: e.target.value,
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="City"
                      className="border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                    <input
                      required
                      placeholder="State"
                      className="border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                  </div>
                  <input
                    required
                    placeholder="Pincode"
                    className="w-full border border-stone-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                  />

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1 py-3 border border-stone-300 rounded-xl text-stone-600 font-medium hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-[#3d5635]"
                    >
                      {loading ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: SUMMARY & CONFIRM */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2 text-primary">
                <CheckCircle className="text-secondary" /> Order Summary
              </h2>

              <div className="bg-nora-beige p-6 rounded-2xl mb-6 border border-primary/10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-primary/10 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary bg-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-primary/10">
                        {item.quantity}x
                      </span>
                      <span className="text-stone-800 font-medium text-lg">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-stone-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {/* Delivery Charge Note */}
                <div className="flex justify-between items-center py-3 border-t border-primary/10 mt-2 text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck size={18} />
                    <span>Delivery Charge</span>
                  </div>
                  <span className="font-medium text-sm bg-accent/20 text-stone-800 px-2 py-1 rounded">
                    ₹70/Kg
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 mt-2 border-t border-primary/20">
                  <span className="text-lg font-bold text-stone-800">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-primary block">
                      ₹{getTotalPrice()}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                      + Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-700 text-sm mb-6 border border-blue-100">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <p>
                  By confirming, you will be redirected to{" "}
                  <strong>WhatsApp</strong>. We will calculate final
                  weight-based shipping and finalize payment there.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-stone-500 font-bold flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {/* DIRECT CONFIRM ACTION */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-[#25D366] text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors flex items-center gap-2 shadow-md shadow-green-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" /> Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" /> Confirm Order
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
