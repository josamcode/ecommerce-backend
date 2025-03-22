const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use("/images", express.static(path.resolve("public/images")));

app.use(
  cors({
    origin: ["https://josam-ecommerce.vercel.app"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/contactRoutes"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/collections", require("./routes/collectionRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Ecommerce Backend API!",
    status: "success",
  });
});

// const stripe = require("stripe")(process.env.STRIPE);

app.post("/api/payments", async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
  console.log("server is now running!");
});
