// components/Cart.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/lib/store/cartStore';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

const Cart: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const handleCheckout = () => {
    closeCart(); // Close the cart first
    router.push('/checkout'); // Navigate to checkout page
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <ShoppingCart size={24} />
              Cart ({getTotalItems()})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500">Add some services to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.$id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-800 truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          by {item.supplier}
                        </p>
                        <p className="font-bold text-blue-600">
                          Ksh {item.price}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.$id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                        >
                          <Minus size={16} className="text-blue-600" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.$id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                        >
                          <Plus size={16} className="text-blue-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.$id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-blue-800">
                  Ksh {getTotalPrice().toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;


// // components/Cart.tsx
// "use client";

// import React from 'react';
// import { useCartStore } from '@/app/lib/store/cartStore';
// import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

// const Cart: React.FC = () => {
//   const {
//     items,
//     isOpen,
//     closeCart,
//     removeItem,
//     updateQuantity,
//     clearCart,
//     getTotalItems,
//     getTotalPrice,
//   } = useCartStore();

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-50 z-40"
//         onClick={closeCart}
//       />
      
//       {/* Cart Sidebar */}
//       <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
//               <ShoppingCart size={24} />
//               Cart ({getTotalItems()})
//             </h2>
//             <button
//               onClick={closeCart}
//               className="p-2 hover:bg-gray-100 rounded-full transition"
//             >
//               <X size={24} className="text-gray-600" />
//             </button>
//           </div>

//           {/* Cart Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {items.length === 0 ? (
//               <div className="text-center py-12">
//                 <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-600 mb-2">
//                   Your cart is empty
//                 </h3>
//                 <p className="text-gray-500">Add some services to get started!</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {items.map((item) => (
//                   <div
//                     key={item.$id}
//                     className="bg-gray-50 rounded-lg p-4 border border-gray-200"
//                   >
//                     <div className="flex gap-3">
//                       {item.imageUrl && (
//                         <img
//                           src={item.imageUrl}
//                           alt={item.title}
//                           className="w-16 h-16 object-cover rounded-md"
//                         />
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-semibold text-blue-800 truncate">
//                           {item.title}
//                         </h4>
//                         <p className="text-sm text-gray-600 mb-2">
//                           by {item.supplier}
//                         </p>
//                         <p className="font-bold text-blue-600">
//                           Ksh {item.price}
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Quantity Controls */}
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => updateQuantity(item.$id, item.quantity - 1)}
//                           className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
//                         >
//                           <Minus size={16} className="text-blue-600" />
//                         </button>
//                         <span className="w-8 text-center font-semibold">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => updateQuantity(item.$id, item.quantity + 1)}
//                           className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
//                         >
//                           <Plus size={16} className="text-blue-600" />
//                         </button>
//                       </div>
//                       <button
//                         onClick={() => removeItem(item.$id)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           {items.length > 0 && (
//             <div className="border-t border-gray-200 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-lg font-semibold text-gray-800">Total:</span>
//                 <span className="text-xl font-bold text-blue-800">
//                   Ksh {getTotalPrice().toLocaleString()}
//                 </span>
//               </div>
              
//               <div className="space-y-3">
//                 <button
//                   onClick={() => {
//                     // Handle checkout logic here
//                     alert(`Proceeding to checkout with ${getTotalItems()} items totaling Ksh ${getTotalPrice().toLocaleString()}`);
//                   }}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
//                 >
//                   Checkout
//                 </button>
                
//                 <button
//                   onClick={clearCart}
//                   className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;