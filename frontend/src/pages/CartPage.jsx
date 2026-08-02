import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/endpoints";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    setError("");
    setPlacing(true);
    try {
      await orderApi.place({
        userId: user.userId,
        shippingAddress: address || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-700 text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/60">Add a few things you like and they'll show up here.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-2xl font-700 text-ink">Your cart</h1>

      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-ink/60">${item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-2.5 py-1.5 text-ink/60 transition hover:text-ink"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-2.5 py-1.5 text-ink/60 transition hover:text-ink"
                aria-label="Increase quantity"
                disabled={item.quantity >= item.stockQuantity}
              >
                <Plus size={13} />
              </button>
            </div>

            <p className="w-20 text-right font-display font-600 text-ink">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-ink/30 transition hover:text-red-600"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
          Shipping address (optional)
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="221B Baker Street, London"
            className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500"
          />
        </label>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm text-ink/60">Total</span>
          <span className="font-display text-xl font-700 text-ink">${total.toFixed(2)}</span>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={placing}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 disabled:opacity-50"
        >
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}
