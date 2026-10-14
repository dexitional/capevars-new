import { Link } from "@tanstack/react-router";
import { asset } from "#/lib/asset";

export function NotFoundPage() {
  return (
    <div className="hero-navy flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center text-white">
      <img src={asset("logo-mark-light.png")} alt="" className="h-20 w-auto opacity-90" />
      <p className="mt-8 text-sm font-bold tracking-[0.3em] text-brand-cream uppercase">404</p>
      <h1 className="mt-2 text-4xl font-black">This page has switched off.</h1>
      <p className="mt-3 max-w-md text-white/70">The link may be broken, or the page may have moved. Try searching, or head back home.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="rounded-full bg-brand-cream px-6 py-3 font-semibold text-primary hover:bg-brand-butter">
          Go home
        </Link>
        <Link to="/search" className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">
          Search
        </Link>
      </div>
    </div>
  );
}
