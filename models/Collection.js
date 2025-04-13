const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  image: { type: String, required: true },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  value: { type: String, required: true, unique: true }
}, { timestamps: true });

class CollectionModel {
  // Get all collections based on language
  static async getAll(lang = "en") {
    const collections = await this.model.find();
    return collections.map(collection => ({
      id: collection._id,
      name: collection.name[lang],
      image: collection.image,
      description: collection.description[lang],
      value: collection.value
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
        value: collection.value
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

CollectionModel.model = mongoose.model('Collection', collectionSchema);

module.exports = CollectionModel;
