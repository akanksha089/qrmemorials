const Joi = require("joi");
const db = require("../config/mysql_database");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const schema = Joi.object({
    user: Joi.object({
      id: Joi.number().required(),
      name: Joi.string(),
      email: Joi.string().email()
    }).required(),

    shipping: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      country: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postal_code: Joi.string().required()
    }).required(),

    billing: Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      country: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postal_code: Joi.string().required()
    }).required(),

    payment: Joi.object({
      method: Joi.string().valid('COD', 'CC').required(),
      amount: Joi.number().required(),
      status: Joi.string().valid('pending', 'paid', 'failed').default('pending'),
      transaction_id: Joi.string().allow(null, '')
    }).required(),

    order_status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered').default('pending'),

      products: Joi.array().items(
      Joi.object({
        product_id: Joi.number().required(),
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().required()
      })
    ).required()
  });

  // Validate request
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return next(new ErrorHandler(err.details.map(d => d.message), 400));
  }

  const { user, shipping, billing, payment, order_status, products  } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Insert Order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total_amount, payment_status, order_status ) VALUES (?, ?, ?, ?)',
      [user.id, payment.amount, payment.status, order_status ]
    );
    const orderId = orderResult.insertId;

    // 2. Insert Shipping Address
    await conn.query(
      `INSERT INTO shipping_addresses 
       ( first_name, last_name, country, address, city, state, postal_code, order_id)
       VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [ shipping.first_name, shipping.last_name, shipping.country, shipping.address, shipping.city, shipping.state, shipping.postal_code, orderId]
    );

    // 3. Insert Billing Address
    await conn.query(
      `INSERT INTO billing_addresses 
       ( first_name, last_name, email, phone, country, address, city, state, postal_code, order_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [ billing.first_name, billing.last_name, billing.email, billing.phone, billing.country, billing.address, billing.city, billing.state, billing.postal_code, orderId]
    );

    // 4. Insert Payment
    await conn.query(
      `INSERT INTO payments 
       (order_id, method, amount, status, transaction_id)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, payment.method, payment.amount, payment.status, payment.transaction_id || null]
    );
     // 5. Insert Order Items (Products)
    for (const product of products) {
      await conn.query(
        `INSERT INTO order_items 
         (order_id, product_id, name, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, product.product_id, product.name, product.quantity, product.price]
      );
    }

    // Commit transaction
    await conn.commit();
    conn.release();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId
    });

  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error("Create Order Error:", error);
    return next(new ErrorHandler('Failed to create order', 500));
  }
});

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id AS order_id,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.created_at AS order_created_at,

        s.first_name AS shipping_first_name,
        s.last_name AS shipping_last_name,
        s.country AS shipping_country,
        s.address AS shipping_address,
        s.city AS shipping_city,
        s.state AS shipping_state,
        s.postal_code AS shipping_postal_code,

        b.first_name AS billing_first_name,
        b.last_name AS billing_last_name,
        b.email AS billing_email,
        b.phone AS billing_phone,
        b.country AS billing_country,
        b.address AS billing_address,
        b.city AS billing_city,
        b.state AS billing_state,
        b.postal_code AS billing_postal_code,

        p.method AS payment_method,
        p.amount AS payment_amount,
        p.status AS payment_status,
        p.transaction_id AS payment_transaction_id

      FROM orders o
      LEFT JOIN shipping_addresses s ON o.id = s.order_id
      LEFT JOIN billing_addresses b ON o.id = b.order_id
      LEFT JOIN payments p ON o.id = p.order_id
      ORDER BY o.id DESC
    `);
     // 2. Fetch all order items
    const [items] = await db.query(`
      SELECT 
        order_id, 
        product_id, 
        name, 
        quantity, 
        price 
      FROM order_items
    `);
    // 3. Attach items to their corresponding order
    const ordersWithItems = orders.map(order => {
      const products = items.filter(item => item.order_id === order.order_id);
      return { ...order, products };
    });
    const message = req.flash("msg_response");

    res.render("orders/index", {
      layout: "layouts/main",
      title: "All Orders",
      orders:ordersWithItems,
      message,
      module_slug: "orders"
    });

  } catch (err) {
    console.error("Error fetching orders:", err);
    return next(new ErrorHandler("Unable to fetch orders", 500));
  }
});




const shippingSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  country: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required()
});

const billingSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required()
});


exports.addShippingAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    await shippingSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return next(new ErrorHandler(error.details.map(d => d.message), 400));
  }

  const {
    first_name,
    last_name,
    country,
    address,
    city,
    state,
    postal_code
  } = req.body;

  try {
    await db.query(
      `INSERT INTO shipping_addresses 
       (first_name, last_name, country, address, city, state, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, country, address, city, state, postal_code]
    );

    res.status(201).json({
      success: true,
      message: "Shipping address added successfully"
    });
  } catch (err) {
    console.error("MySQL Error:", err);
    return next(new ErrorHandler("Database insertion failed", 500));
  }
});

exports.getAllShippingAddresses = catchAsyncErrors(async (req, res, next) => {
  try {
    const [addresses] = await db.query("SELECT * FROM shipping_addresses ORDER BY id DESC");

    const message = req.flash("msg_response");
 res.render("shipping" + "/index", {
      layout: "layouts/main",
      title: "Shipping Addresses",
      addresses,
      message,
      module_slug: "shipping"
    });
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    return next(new ErrorHandler("Unable to fetch shipping addresses", 500));
  }
});

exports.addBillingAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    await billingSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return next(new ErrorHandler(error.details.map(d => d.message), 400));
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    country,
    address,
    city,
    state,
    postal_code
  } = req.body;

  try {
    await db.query(
      `INSERT INTO billing_addresses 
       (first_name, last_name, email, phone, country, address, city, state, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, country, address, city, state, postal_code]
    );

    res.status(201).json({
      success: true,
      message: "Billing address added successfully"
    });
  } catch (err) {
    console.error("MySQL Error:", err);
    return next(new ErrorHandler("Database insertion failed", 500));
  }
});

exports.getAllBillingAddresses = catchAsyncErrors(async (req, res, next) => {
  try {
    const [addresses] = await db.query("SELECT * FROM billing_addresses ORDER BY id DESC");

    const message = req.flash("msg_response");
 res.render("billing" + "/index", {
      layout: "layouts/main",
      title: "Billing Addresses",
      addresses,
      message,
      module_slug: "billing"
    });
  } catch (error) {
    console.error("Error fetching billing addresses:", error);
    return next(new ErrorHandler("Unable to fetch billing addresses", 500));
  }
});