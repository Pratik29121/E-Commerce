import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-700 tracking-tight text-ink">
          Northline
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-ink/70">
          <Link to="/" className="transition hover:text-ink">
            Shop
          </Link>

          {user && (
            <Link to="/orders" className="flex items-center gap-1.5 transition hover:text-ink">
              <Package size={16} />
              Orders
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center gap-1.5 transition hover:text-ink">
            <ShoppingCart size={16} />
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3 border-l border-line pl-6">
              <span className="flex items-center gap-1.5 text-ink/70">
                <User size={16} />
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-ink/50 transition hover:text-ink"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-ink px-4 py-1.5 text-white transition hover:bg-ink/85"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
