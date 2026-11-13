import { useSyncExternalStore } from "react";

export type BasketItem = {
  id: string;
  quantity: number;
};

const BASKET_STORAGE_KEY = "grand-screen-tickets";
const BASKET_CHANGED_EVENT = "grand-screen-tickets-changed";
const EMPTY_BASKET: BasketItem[] = [];
let cachedBasketRaw: string | null | undefined;
let cachedBasketSnapshot: BasketItem[] = EMPTY_BASKET;

const normalizeBasket = (value: unknown): BasketItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is BasketItem =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "quantity" in item &&
        typeof item.id === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
    )
    .map((item) => ({ id: item.id, quantity: Math.floor(item.quantity) }));
};

const readBasketFromStorage = (): BasketItem[] => {
  if (typeof window === "undefined") {
    return EMPTY_BASKET;
  }

  const raw = window.localStorage.getItem(BASKET_STORAGE_KEY);
  if (raw === cachedBasketRaw) {
    return cachedBasketSnapshot;
  }

  cachedBasketRaw = raw;

  if (!raw) {
    cachedBasketSnapshot = EMPTY_BASKET;
    return cachedBasketSnapshot;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    cachedBasketSnapshot = normalizeBasket(parsed);
  } catch {
    cachedBasketSnapshot = EMPTY_BASKET;
  }

  return cachedBasketSnapshot;
};

const writeBasketToStorage = (basket: BasketItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const raw = JSON.stringify(basket);
  window.localStorage.setItem(BASKET_STORAGE_KEY, raw);
  cachedBasketRaw = raw;
  cachedBasketSnapshot = basket;
  window.dispatchEvent(new Event(BASKET_CHANGED_EVENT));
};

const subscribeBasket = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener(BASKET_CHANGED_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(BASKET_CHANGED_EVENT, handler);
  };
};

const getServerBasketSnapshot = (): BasketItem[] => EMPTY_BASKET;

export const useBasket = () => {
  const basket = useSyncExternalStore(
    subscribeBasket,
    readBasketFromStorage,
    getServerBasketSnapshot
  );

  const updateBasket = (updater: (current: BasketItem[]) => BasketItem[]) => {
    const current = readBasketFromStorage();
    const next = normalizeBasket(updater(current));
    writeBasketToStorage(next);
  };

  const clearBasket = () => {
    writeBasketToStorage([]);
  };

  return { basket, updateBasket, clearBasket };
};
