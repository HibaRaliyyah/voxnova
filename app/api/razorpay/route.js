import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: 1000, // ₹10 = 1000 paise
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  });

  return NextResponse.json(order);
}
