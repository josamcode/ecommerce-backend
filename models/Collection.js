const mongoose = require("mongoose");

const initialCollections = [
  {
    name: { en: "Luxury Watches", ar: "ساعات فاخرة" },
    image: "tissot-1.jpg",
    description: {
      en: "luxury watches for men and women",
      ar: "ساعات فاخرة للرجال والنساء",
    },
    value: "luxury_watches",
  },
  {
    name: { en: "Accessories", ar: "إكسسوارات" },
    image: "accessories-1.jpg",
    description: {
      en: "Accessories for men and women",
      ar: "إكسسوارات للرجال والنساء",
    },
    value: "accessories",
  },
  {
    name: {
      en: "Low budget watches",
      ar: "ساعات رخيصة الثمن",
    },
    image: "cheap-watches.jpg",
    description: {
      en: "Low budget watches for men and women",
      ar: "ساعات رخيصة الثمن للرجال والنساء",
    },
    value: "cheap-watches",
  },
];

const collectionSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    image: { type: String, required: true },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    value: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

class CollectionModel {
  // Initialize collections if they don't exist
  static async initializeCollections() {
    try {
      const count = await this.model.countDocuments();
      if (count === 0) {
        await this.model.insertMany(initialCollections);
        console.log("Initial collections have been added to the database");
      }
    } catch (error) {
      console.error("Error initializing collections:", error);
    }
  }

  // Get all collections based on language
  static async getAll(lang = "en") {
    const collections = await this.model.find();
    return collections.map((collection) => ({
      id: collection._id,
      name: collection.name[lang],
      image: collection.image,
      description: collection.description[lang],
      value: collection.value,
    }));
  }

  // Get a single collection based on ID and language
  static async getById(id, lang = "en") {
    const collection = await this.model.findById(id);
    if (collection) {
      return {
        id: collection._id,
        name: collection.name[lang],
        image: collection.image,
        description: collection.description[lang],
        value: collection.value,
      };
    }
    return null;
  }

  // Add new collection
  static async add(newCollection) {
    const collection = new this.model(newCollection);
    await collection.save();
    return this.getById(collection._id);
  }

  // Update collection
  static async update(id, updatedData) {
    const collection = await this.model.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );
    if (collection) {
      return this.getById(collection._id);
    }
    return null;
  }

  // Delete collection
  static async delete(id) {
    const collection = await this.model.findByIdAndDelete(id);
    return collection;
  }
}

CollectionModel.model = mongoose.model("Collection", collectionSchema);

module.exports = CollectionModel;
