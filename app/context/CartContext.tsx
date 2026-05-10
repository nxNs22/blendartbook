"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

export interface CartItem {
  id: string | number;
  title: string;
  price: number | string;
  quantity: number;
  cover?: string;
  author?: string;
  image_url?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string | number) => void;
  cartCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // İlk yüklemeyi takip etmek için state yerine ref kullanıyoruz (Re-render tetiklemez)
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 1. AŞAMA: Sayfa ilk yüklendiğinde (Mount) - Sadece Oku
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        const savedCart = localStorage.getItem("my-book-cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart) as CartItem[];
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Sepet okuma hatası:", err.message);
        }
      }
      return; // İlk render'da aşağıdaki kaydetme işlemini atla ki boş sepeti kaydetmesin
    }

    // 2. AŞAMA: Sepet her değiştiğinde (Update) - Kaydet
    try {
      localStorage.setItem("my-book-cart", JSON.stringify(cart));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Sepet kaydetme hatası:", err.message);
      } else {
        console.error("Beklenmedik sepet kaydetme hatası:", err);
      }
    }
  }, [cart]); // Her iki işlem için tek bir bağımlılık yeterli

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);

      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart hook'u sadece CartProvider içinde kullanılabilir!",
    );
  }
  return context;
}
