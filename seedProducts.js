const mongoose = require("mongoose");
const FeaturedProduct = require("./models/FeaturedProduct");

require("dotenv").config();

const addProducts = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const products = [
    {
      name: "Classic T-Shirt",
      description: "A comfortable and stylish classic t-shirt.",
      price: 20,
      image: "unisex2.jpg",
      images: ["tshirt.jpg", "tshirt_back.jpg"],
      category: "Clothing",
      brand: "FashionCo",
      rating: 4.5,
      reviewsCount: 120,
      stock: 100,
      specifications: { material: "Cotton", size: "M" },
    },
    {
      name: "Hoodie",
      description: "A warm and cozy hoodie for chilly days.",
      price: 40,
      image: "denim_back.jpg",
      images: ["tshirt_back.jpg", "tshirt.jpg"],
      category: "Clothing",
      brand: "CozyWear",
      rating: 4.8,
      reviewsCount: 200,
      stock: 50,
      specifications: { material: "Fleece", size: "L" },
    },
    {
      name: "Jeans",
      description: "Stylish and durable denim jeans.",
      price: 50,
      image: "leather_back.jpg",
      images: ["leather_jacket.jpg", "leather_front.jpg"],
      category: "Clothing",
      brand: "DenimKing",
      rating: 4.7,
      reviewsCount: 150,
      stock: 80,
      specifications: { material: "Denim", size: "32" },
    },
    {
        name: "Running Shoes",
        description: "Lightweight and comfortable running shoes.",
        price: 60,
        image: "shoes_back.jpg",
        images: ["running_shoes.jpg", "shoes_front.jpg"],
        category: "Footwear",
        brand: "SportyFit",
        rating: 4.9,
        reviewsCount: 300,
        stock: 120,
        specifications: { material: "Mesh", size: "42" },
      },
      {
        name: "Formal Shoes",
        description: "Elegant leather formal shoes for office wear.",
        price: 80,
        image: "shoes_front.jpg",
        images: ["shoes_back.jpg", "running_shoes.jpg"],
        category: "Footwear",
        brand: "ElegantStep",
        rating: 4.6,
        reviewsCount: 180,
        stock: 60,
        specifications: { material: "Leather", size: "43" },
      },
  ];

  try {
    await FeaturedProduct.insertMany(products);
    console.log("Products added successfully!");
  } catch (err) {
    console.error("Error adding products:", err);
  } finally {
    mongoose.connection.close();
  }
};

addProducts();
