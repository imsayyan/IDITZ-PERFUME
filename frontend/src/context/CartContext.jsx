import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { settings } = useSettings();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('noore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('noore_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('noore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('noore_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('noore_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, size = '100ml') => {
    if (product.stock_quantity !== undefined && product.stock_quantity <= 0) {
      return;
    }
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        // Cap at stock quantity if available
        const maxStock = product.stock_quantity !== undefined ? product.stock_quantity : 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        const itemImage = Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : (typeof product.images === 'string' ? product.images : '/images/perfumes/kashmir-saffron-amber.svg');

        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            price: product.price,
            mrp: product.mrp,
            image: itemImage,
            size: size || product.size || '100ml',
            quantity: Math.min(quantity, product.stock_quantity || 99),
            stock_quantity: product.stock_quantity || 99,
            fragrance_family: product.fragrance_family
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId && item.size === size) {
          const maxStock = item.stock_quantity || 99;
          return { ...item, quantity: Math.min(newQty, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('noore_cart');
    localStorage.removeItem('noore_coupon');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Totals calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const freeThreshold = Number(settings.free_shipping_threshold || 999);
  const standardShipping = Number(settings.shipping_charge || 150);
  const isFreeShipping = subtotal >= freeThreshold;
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : standardShipping);
  const freeShippingRemaining = Math.max(0, freeThreshold - subtotal);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= (appliedCoupon.min_order_value || 0)) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount_amount) / 100);
    } else {
      discount = Math.min(appliedCoupon.discount_amount, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code) => {
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await api.validateCoupon(code, subtotal);
      setAppliedCoupon({
        code: res.code,
        discount_type: res.discount_type,
        discount_amount: res.discount_amount,
        calculatedDiscount: res.calculatedDiscount,
        min_order_value: res.min_order_value || 0
      });
      setCouponSuccess(res.message);
      return { success: true, message: res.message };
    } catch (err) {
      setCouponError(err.message);
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        finalTotal,
        freeShippingRemaining,
        freeThreshold,
        isFreeShipping,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        couponSuccess
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
