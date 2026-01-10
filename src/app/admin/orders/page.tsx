"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Calendar,
} from "lucide-react";

// --- TYPES ---
type OrderProfile = {
  name: string;
  email: string;
};

type Order = {
  id: number;
  created_at: string;
  status: string; // pending, processing, shipped, delivered, cancelled
  total_amount: number;
  payment_status: string;
  shipping_address: any; // JSONB in DB
  profile: OrderProfile | null; // Joined from 'profiles' table
};

export default function AdminOrdersPage() {
  const supabase = createClient();

  // --- STATE ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // --- FETCH DATA ---
  const fetchOrders = async () => {
    setLoading(true);

    // Join with 'profiles' to get customer name/email
    // Note: ensure you have a Foreign Key from orders.user_id to profiles.id
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profile (
          name, 
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- HANDLERS ---
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Failed to update status");
      console.error(error);
    } else {
      // Optimistic Update: Update local state immediately without refetching
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }

    setUpdatingId(null);
  };

  // --- FILTERING ---
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  // --- HELPERS ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "processing":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div>
      {/* 1. PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
        <p className="text-slate-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* 2. STATS / FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-all ${
              statusFilter === status
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 3. ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={20} /> Loading
                      orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Package className="text-slate-300 mb-2" size={48} />
                      <p>No orders found with status "{statusFilter}".</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    {/* ID & Payment Badge */}
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-slate-700">
                        #{order.id}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            order.payment_status === "paid"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-100"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </td>

                    {/* Customer Details */}
                    <td className="p-4">
                      {order.profile ? (
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {order.profile.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.profile.email}
                          </p>
                          <p
                            className="text-xs text-slate-400 mt-0.5 truncate max-w-[150px]"
                            title={order.shipping_address?.city}
                          >
                            {order.shipping_address?.city},{" "}
                            {order.shipping_address?.state}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">
                          Deleted User
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <span className="text-xs text-slate-400 pl-5">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="p-4 font-bold text-slate-800">
                      ₹{order.total_amount}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <div className="relative w-40">
                        {updatingId === order.id && (
                          <div className="absolute right-2 top-2 z-10">
                            <Loader2
                              className="animate-spin text-slate-400"
                              size={14}
                            />
                          </div>
                        )}
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className={`appearance-none w-full text-xs font-bold uppercase py-2 pl-3 pr-8 rounded-lg border focus:ring-2 focus:ring-offset-1 outline-none transition-colors cursor-pointer ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
