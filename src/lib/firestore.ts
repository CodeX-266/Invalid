import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseClient";
import { CartItem } from "@/context/CartProvider";

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  userId: string;
  name: string;
  phone: string;
  address: OrderAddress;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: any;
}

/**
 * Places a new order in Firestore with full shipping details
 */
export const placeOrder = async (
  userId: string,
  name: string,
  phone: string,
  address: OrderAddress,
  items: CartItem[],
  total: number
): Promise<string> => {
  const ordersRef = collection(db, "orders");

  const newOrder: Order = {
    userId,
    name,
    phone,
    address,
    items,
    total,
    status: "pending", // default status
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(ordersRef, newOrder);
  return docRef.id;
};
