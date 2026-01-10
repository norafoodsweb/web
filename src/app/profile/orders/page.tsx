"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

// --- Types ---
type OrderItem = {
  id: number;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
    image: string;
  } | null; // Product might be deleted, so handle null
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const supabase = createClient();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Check User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // 2. Fetch Orders with nested Items and Products
      // Note: The syntax below relies on Foreign Keys being set up correctly
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (
              name,
              image
            )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [supabase, router]);

  // --- Helper for Status Badge ---
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700"; // pending/processing
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-stone-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-stone-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            No orders yet
          </h2>
          <p className="text-stone-500 mb-6">
            You haven't placed any orders yet. Start adding some delicious
            treats!
          </p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // --- Main List ---
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-800">
            My Orders
          </h1>
          <Link
            href="/profile"
            className="text-stone-500 hover:text-indigo-600 font-medium text-sm"
          >
            Back to Profile
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Order Placed
                    </p>
                    <p className="text-stone-700 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-stone-800 font-bold">
                      ₹{order.total_amount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    #{order.id}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-stone-100 rounded-lg overflow-hidden border border-stone-100">
                          {item.products?.image ? (
                            <Image
                              src={item.products.image}
                              alt={item.products.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-800">
                            {item.products?.name || "Unknown Product"}
                          </h4>
                          <p className="text-sm text-stone-500">
                            Qty: {item.quantity} × ₹{item.price_at_purchase}
                          </p>
                        </div>
                      </div>

                      {/* Optional: Add "Write a Review" button here later */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions (Optional) */}
              {/* <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end">
                 <button className="text-indigo-600 text-sm font-bold hover:underline">View Invoice</button>
              </div> 
              */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
