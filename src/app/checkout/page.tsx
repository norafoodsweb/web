"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/app/context/CartContext"; // Check path!
import {
  CheckCircle,
  MapPin,
  CreditCard,
  Plus,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// --- Types matching your Database ---
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
  const [step, setStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
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

  // 1. Fetch User Addresses on Mount
  useEffect(() => {
    const fetchAddresses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/checkout");
        return;
      }

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (data) {
        setAddresses(data);
        // Auto-select first address if exists
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

  // 3. Handle Order Creation (The "Pay Now" Logic)
  const handlePlaceOrder = async (paymentMethod: "cod" | "online") => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !selectedAddressId) return;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    const totalAmount = getTotalPrice();

    try {
      // 1. Prepare data for the RPC function
      // We need an array of objects like: [{ product_id: 1, quantity: 2 }, ...]
      const stockUpdateData = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      // 2. Call the RPC function to deduct stock
      // This will FAIL if stock is insufficient, stopping the order automatically
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        order_items: stockUpdateData,
      });

      if (stockError) {
        throw new Error(
          "One or more items are out of stock. Please refresh cart."
        );
      }

      // 3. If Stock Deducted Successfully -> Create Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total_amount: totalAmount,
          payment_status: paymentMethod === "cod" ? "pending" : "paid",
          shipping_address: selectedAddr,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Create Order Items (same as before) ...
      // ... (Rest of your existing code)
    } catch (error: any) {
      console.error(error);
      alert("Order failed: " + error.message);
    }
  };

  if (loading && step === 1 && addresses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex flex-col items-center bg-stone-50 px-4`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s
                    ? "bg-indigo-600 text-white"
                    : "bg-stone-300 text-stone-600"
                }`}
              >
                {s}
              </div>
              <span className="text-xs mt-1 font-medium text-stone-600">
                {s === 1 ? "Address" : s === 2 ? "Summary" : "Payment"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 min-h-[400px]">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-indigo-600" /> Select Delivery Address
              </h2>

              {!isAddingNew ? (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-stone-100 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-bold text-stone-800">
                            {addr.name}
                          </p>
                          <p className="text-stone-600 text-sm">
                            {addr.address_line1}, {addr.address_line2}
                          </p>
                          <p className="text-stone-600 text-sm">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-stone-600 text-sm mt-1">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 font-medium hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add New Address
                  </button>

                  <div className="flex justify-end mt-6">
                    <button
                      disabled={!selectedAddressId}
                      onClick={() => setStep(2)}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                      className="border p-3 rounded-lg"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                    />
                    <input
                      required
                      placeholder="Phone Number"
                      className="border p-3 rounded-lg"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                    />
                  </div>
                  <input
                    required
                    placeholder="Address Line 1"
                    className="w-full border p-3 rounded-lg"
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
                    className="w-full border p-3 rounded-lg"
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
                      className="border p-3 rounded-lg"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                    <input
                      required
                      placeholder="State"
                      className="border p-3 rounded-lg"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                  </div>
                  <input
                    required
                    placeholder="Pincode"
                    className="w-full border p-3 rounded-lg"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                  />

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1 py-3 border rounded-lg text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold"
                    >
                      {loading ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: SUMMARY */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="text-indigo-600" /> Order Summary
              </h2>

              <div className="bg-stone-50 p-4 rounded-xl mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-stone-200 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-stone-500">
                        {item.quantity}x
                      </span>
                      <span className="text-stone-800 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-stone-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-stone-200 text-lg font-bold">
                  <span>Total Payable</span>
                  <span className="text-indigo-600">₹{getTotalPrice()}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-stone-500 font-medium flex items-center gap-2 hover:text-stone-800"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-indigo-600" /> Payment Method
              </h2>

              <div className="space-y-4 mb-8">
                {/* 1. Cash on Delivery */}
                <button
                  onClick={() => handlePlaceOrder("cod")}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-6 border rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-200">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-stone-500">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-stone-300 group-hover:text-indigo-600" />
                </button>

                {/* 2. Online Payment (Stub) */}
                <button
                  onClick={() => handlePlaceOrder("online")} // In reality, this would open Razorpay/Stripe
                  disabled={loading}
                  className="w-full flex items-center justify-between p-6 border rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">
                        Pay Online (Card/UPI)
                      </p>
                      <p className="text-sm text-stone-500">
                        Secure payment via Razorpay/Stripe
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-stone-300 group-hover:text-indigo-600" />
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                className="text-stone-500 font-medium flex items-center gap-2 hover:text-stone-800"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
