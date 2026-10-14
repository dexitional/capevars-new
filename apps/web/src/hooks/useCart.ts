// The marketplace cart lives in this browser (localStorage), so visitors can
// shop before signing in. Prices and availability are always re-quoted from
// the server on the cart and checkout pages.
import { useSyncExternalStore } from "react";

export interface CartLine {
  productId: number;
  quantity: number;
  title: string;
  price: number;
  image: string | null;
  slug: string;
  storeName: string;
}

const KEY = "cv-cart-v1";
const listeners = new Set<() => void>();
let cache: Array<CartLine> | null = null;

function read(): Array<CartLine> {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Array<CartLine>;
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: Array<CartLine>) {
  cache = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

const EMPTY: Array<CartLine> = [];

export const cart = {
  add(line: Omit<CartLine, "quantity">, quantity = 1) {
    const lines = read();
    const existing = lines.find((l) => l.productId === line.productId);
    write(
      existing
        ? lines.map((l) => (l.productId === line.productId ? { ...l, ...line, quantity: Math.min(99, l.quantity + quantity) } : l))
        : [...lines, { ...line, quantity }],
    );
  },
  setQuantity(productId: number, quantity: number) {
    write(quantity <= 0 ? read().filter((l) => l.productId !== productId) : read().map((l) => (l.productId === productId ? { ...l, quantity: Math.min(99, quantity) } : l)));
  },
  remove(productId: number) {
    write(read().filter((l) => l.productId !== productId));
  },
  removeMany(ids: Array<number>) {
    write(read().filter((l) => !ids.includes(l.productId)));
  },
  clear() {
    write([]);
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { lines, count, subtotal };
}
