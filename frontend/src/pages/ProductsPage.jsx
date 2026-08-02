import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { productApi } from "../api/endpoints";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Apparel", "Home", "Fitness"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 250); // debounce search input
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const { data } = await productApi.search({
        keyword: keyword || undefined,
        category: category === "All" ? undefined : category,
        size: 24,
      });
      setProducts(data.content);
    } catch {
      setError("Couldn't load products. Is the API gateway running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-700 text-ink">Shop everything</h1>
        <p className="text-sm text-ink/60">Search across electronics, apparel, home and fitness.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 border border-line hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-line/50" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink/50">
          No products match your search. Try a different keyword or category.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
