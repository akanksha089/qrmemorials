import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

 const addToWishlist = (product) => {
    setWishlist((prev) => {
      const alreadyExists = prev.find((item) => item.id === product.id);
      if (!alreadyExists) {
        toast.success('Added to wishlist!');
        return [...prev, product];
      } else {
        toast.info('This item is already in your wishlist.');
        return prev;
      }
    });
  };

  const removeFromWishlist = (productId) => {
    toast.warn('Removed from wishlist');
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };
  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
