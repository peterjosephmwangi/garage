// components/CartIcon.tsx
"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/lib/store/cartStore';

const CartIcon: React.FC = () => {
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-blue-600 hover:text-blue-800 transition-colors"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;