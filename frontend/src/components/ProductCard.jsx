import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const outOfStock = product.stockQuantity === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-brand-400/60 hover:shadow-[0_4px_20px_rgba(15,122,99,0.08)]"
    >
      <div className="relative aspect-square overflow-hidden bg-line/40">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-white">
            Out of stock
          </span>
        )}
        {!outOfStock && lowStock && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white">
            Only {product.stockQuantity} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[11px] font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="font-display text-base font-600 leading-snug text-ink">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-display text-lg font-600 text-ink">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
