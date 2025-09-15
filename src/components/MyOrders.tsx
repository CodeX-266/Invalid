"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: OrderAddress;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: any;
}

interface MyOrdersProps {
  onClose: () => void;
}

export default function MyOrders({ onClose }: MyOrdersProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetchedOrders: Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(fetchedOrders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => filter === "all" ? true : order.status === filter);
  const allStatuses = ["pending", "confirmed", "shipped", "delivered"];

  const cancelOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o));
      toast.success("Order cancelled successfully");
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: "cancelled" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Please sign in to view your orders.</p>;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        className="fixed top-0 right-0 h-full bg-gray-900 z-50 shadow-2xl w-full sm:w-80 md:w-96 lg:w-[40%] flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-400">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all","pending","confirmed","shipped","delivered","cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-3 py-1 rounded ${filter === f ? "bg-indigo-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && <p className="text-gray-300 text-center">Loading orders...</p>}

          {/* Order List */}
          {!loading && !selectedOrder && (
            <div className="space-y-4">
              {filteredOrders.length === 0 && <p className="text-gray-400 text-center mt-10">No orders found.</p>}
              {filteredOrders.map(order => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg transition"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Order ID: {order.id.slice(0,8)}</span>
                    <span className={`capitalize font-bold ${order.status === "cancelled" ? "text-red-500" : "text-green-500"}`}>{order.status}</span>
                  </div>
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {order.items.map(item => (
                      <Image key={item.id} src={item.image} alt={item.name} width={60} height={60} className="rounded" />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-gray-300">
                    <span>Total: ${order.total.toFixed(2)}</span>
                    <span>{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Selected Order Details */}
          {selectedOrder && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-4">
              <button onClick={() => setSelectedOrder(null)} className="mb-4 text-indigo-400 hover:text-indigo-200">← Back to Orders</button>
              <h2 className="text-2xl text-white font-bold mb-4">Order ID: {selectedOrder.id}</h2>
              <p className="text-gray-300 mb-2">Shipping To:</p>
              <div className="bg-gray-800 p-4 rounded text-white mb-4 space-y-1">
                <p>{selectedOrder.name}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}</p>
                <p>{selectedOrder.address.pincode}, {selectedOrder.address.country}</p>
              </div>

              {/* Status Timeline */}
              <div className="flex items-center justify-between mb-6">
                {allStatuses.map((status, idx) => {
                  const active = allStatuses.indexOf(selectedOrder.status) >= idx;
                  return (
                    <div key={status} className="flex-1 flex flex-col items-center relative">
                      {idx !== 0 && <div className={`absolute left-0 top-3 w-full h-1 ${active ? "bg-green-500" : "bg-gray-700"}`}></div>}
                      <div className={`w-6 h-6 rounded-full ${active ? "bg-green-500" : "bg-gray-700"} z-10`} />
                      <span className="text-xs mt-1 capitalize text-gray-300">{status}</span>
                    </div>
                  );
                })}
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-3 rounded">
                    <Image src={item.image} alt={item.name} width={60} height={60} className="rounded" />
                    <div className="flex-1 text-white">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-300">Qty: {item.quantity}</p>
                      <p className="text-gray-300">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-white font-bold mb-4">
                <span>Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>

              {/* Cancel Order */}
              {selectedOrder.status === "pending" && (
                <button
                  onClick={() => cancelOrder(selectedOrder.id)}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
