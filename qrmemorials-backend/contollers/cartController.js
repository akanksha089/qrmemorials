const db = require("../config/mysql_database");

// Add item to cart
exports.addToCart = async (req, res) => {
  const user_id = req.user.id;  // from auth middleware
  const { package_id, quantity } = req.body;

  if (!package_id || !quantity) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM carts WHERE user_id = ? AND package_id = ?",
      [user_id, package_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND package_id = ?",
        [quantity, user_id, package_id]
      );
    } else {
      await db.query(
        "INSERT INTO carts (user_id, package_id, quantity) VALUES (?, ?, ?)",
        [user_id, package_id, quantity]
      );
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cart items for authenticated user
exports.getCart = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ message: 'Unauthorized: No user ID found' });

  try {
    const [cartItems] = await db.query(
      `SELECT 
        c.id, 
        c.quantity, 
        p.title AS package_name, 
        p.price,
        p.image AS image_url  -- Changed from p.image_url to p.image (SQL-style comment)
       FROM carts c 
       JOIN packages p ON c.package_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    // Process image URLs
    const cartItemsWithUrls = cartItems.map(item => ({
      ...item,
      image_url: item.image_url 
        ? `${req.protocol}://${req.get('host')}/uploads/packages/${item.image_url}`
        : null
    }));

    res.json(cartItemsWithUrls);
  } catch (err) {
    console.error('Error fetching cart:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    // 1. Get IDs from request
    const cartItemId = parseInt(req.params.cartId);
    const userId = req.user.id; // From JWT via isApiAuthenticatedUser
console.log("params:", req.params);
    // 2. Validate input
if (!cartItemId) {
  return res.status(400).json({
    success: false,
    message: "Cart item ID is missing",
    code: "MISSING_CART_ID"
  });
}

    // 3. Execute deletion
    const [result] = await db.query(
      `DELETE FROM carts 
       WHERE id = ? AND user_id = ?`,
      [cartItemId, userId]
    );

    // 4. Check if deletion was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found or doesn't belong to you",
        code: "ITEM_NOT_FOUND",
        details: {
          requestedCartItemId: cartItemId,
          authorizedUserId: userId
        }
      });
    }

    // 5. Success response
    return res.json({
      success: true,
      message: "Item removed from cart successfully",
      deletedCartItemId: cartItemId
    });

  } catch (error) {
    console.error("[CART] Deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack
      })
    });
  }
};

exports.removeFromCart = removeFromCart;
