import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { productApi } from "../api/endpoints";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    productApi
      .getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError("This product couldn't be found."));
  }, [id]);

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  if (error) {
    return <p className="mx-auto max-w-6xl px-6 py-16 text-sm text-red-700">{error}</p>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-line/50" />
          <div className="space-y-3">
            <div className="h-6 w-1/3 animate-pulse rounded bg-line/50" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-line/50" />
            <div className="h-24 w-full animate-pulse rounded bg-line/50" />
          </div>
        </div>
      </div>
    );
  }

  const outOfStock = product.stockQuantity === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mt-6 grid gap-10 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-line/40">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-700 text-ink">{product.name}</h1>
          <p className="mt-4 font-display text-3xl font-600 text-ink">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-ink/70">{product.description}</p>

          <p className="mt-4 text-sm">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : (
              <span className="text-ink/60">{product.stockQuantity} in stock</span>
            )}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-line">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-ink/60 transition hover:text-ink"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-2 text-ink/60 transition hover:text-ink"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85"
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to cart
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
