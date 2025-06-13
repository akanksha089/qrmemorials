const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
const errorMiddleware = require("./middleware/error");
const multer = require('multer');
const app = express();

const upload = multer();
// CORS setup
app.use(
  cors({
origin: "https://soul-link-ten.vercel.app", // Adjust your frontend URL
   //origin: "http://localhost:5173", // Adjust your frontend URL
    credentials: true,
  })
);

// EJS setup for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
// app.use(upload.none()); // Use .none() for forms without file uploads
// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware setup
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
// app.use("/backend/uploads", express.static(path.resolve(__dirname, "../backend/uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads').replace(/\\/g, '/')));
app.use(cookieParser());
app.use(express.json());

// Session setup
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot", // Change secret for production
    resave: false,
    httpOnly: true,
    saveUninitialized: false,
  })
);

// Flash messages setup
app.use(flash());

// Import routes
const blogs = require("./routes/blogRoute");
const quizzes = require("./routes/quizRoute");
const cart = require("./routes/cartRoute");
const pages = require("./routes/pageRoute");
const packages = require("./routes/packageRoute");
const user = require("./routes/userRoute");
const settings = require("./routes/settingRoute");
const faqs = require("./routes/faqRoute");
const testimonials = require("./routes/testimonialRoute");
const contact = require("./routes/contactRoute");
const feature = require("./routes/featureRoute");
const block = require("./routes/orderRoute");

// Admin routes
app.use("/admin", user);
app.use("/admin", blogs);
app.use("/admin", quizzes);
app.use("/admin", packages);
app.use("/admin", cart);
app.use("/admin", pages);
app.use("/admin", settings);
app.use("/admin", faqs);
app.use("/admin", testimonials);
app.use("/admin", feature);
app.use("/admin", block);

// API routes (version 1)
app.use("/api/v1", user);
app.use("/api/v1", blogs);
app.use("/api/v1", quizzes);
app.use("/api/v1", packages);
app.use("/api/v1", cart);
app.use("/api/v1", pages);
app.use("/api/v1", settings);
app.use("/api/v1", faqs);
app.use("/api/v1", testimonials);
app.use("/api/v1", contact);
app.use("/api/v1", feature);
app.use("/api/v1", block);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
