import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/endpoints";

const STATUS_STYLES = {
  PLACED: "bg-amber-400/15 text-amber-600",
  CONFIRMED: "bg-brand-100 text-brand-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-brand-100 text-brand-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi
      .getByUser(user.userId)
      .then(({ data }) => setOrders(data))
      .catch(() => setError("Couldn't load your orders."))
      .finally(() => setLoading(false));
  }, [user.userId]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-700 text-ink">Your orders</h1>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-line/50" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Package size={32} className="text-ink/30" />
          <p className="mt-3 text-sm text-ink/50">You haven't placed any orders yet.</p>
          <Link to="/" className="mt-4 text-sm font-medium text-brand-600 hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">Order #{order.id}</p>
                  <p className="text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status] || "bg-line text-ink/60"}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 divide-y divide-line border-t border-line">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink/80">
                      {item.productName} <span className="text-ink/40">× {item.quantity}</span>
                    </span>
                    <span className="text-ink/70">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="text-sm text-ink/60">Total</span>
                <span className="font-display font-600 text-ink">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
