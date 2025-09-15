import { db } from "./firebaseClient"; // make sure you export db from firebaseClient.ts
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "@/context/CartProvider";

/**
 * Places a new order in Firestore
 * @param userId - Firebase Auth UID of the user
 * @param items - Cart items
 * @param total - Total order amount
 * @returns new order document ID
 */
export async function placeOrder(userId: string, items: CartItem[], total: number) {
  const ordersRef = collection(db, "orders");

  const newOrder = {
    userId,
    items,
    total,
    status: "pending", // can later be updated by admin
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(ordersRef, newOrder);
  return docRef.id;
}
