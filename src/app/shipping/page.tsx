"use client";

import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Shipping Policy</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            All orders are processed within <strong>2 to 5 business days</strong> (excluding weekends
            and holidays) after receiving your order confirmation email.
          </p>
          <p>
            You will receive another notification when your order has shipped, along with a tracking
            number to monitor the delivery status.
          </p>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. We strive
            to deliver within <strong>7–10 business days</strong>, but delivery timelines may vary
            depending on your location.
          </p>
          <p>
            In the event of delays caused by unforeseen circumstances or third-party carriers, we
            will notify you immediately. However, <strong>Invalid Lifestyle</strong> is not liable
            for delays outside our control.
          </p>
          <p>
            For any shipping-related queries, please contact us at{" "}
            <a
              href="mailto:invalidlifestyle.global@gmail.com"
              className="text-blue-600 underline"
            >
              invalidlifestyle.global@gmail.com
            </a>{" "}
            or call us at <strong>+91 80924 18238</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
