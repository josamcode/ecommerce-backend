const CollectionModel = require("../models/Collection");

// get new collections
exports.getAllCollections = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const allCollections = await CollectionModel.getAll(lang);
    res.json(allCollections);
  } catch (error) {
    console.error('Error getting collections:', error);
    res.status(500).json({ message: 'Error fetching collections' });
  }
};

// get only one collection
exports.getCollectionById = (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";
  const collection = CollectionModel.getById(id, lang);
  if (collection) {
    res.json(collection);
  } else {
    res.status(404).json({ message: "Collection not found" });
  }
};

// add new collection
exports.addCollection = (req, res) => {
  const { name, image, description, value } = req.body;
  const newCollection = {
    name: { en: name.en, ar: name.ar },
    image,
    description: { en: description.en, ar: description.ar },
    value,
  };
  const addedCollection = CollectionModel.add(newCollection);
  res.status(201).json(addedCollection);
};

// update collection
exports.updateCollection = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedCollection = CollectionModel.update(id, updatedData);
  if (updatedCollection) {
    res.json(updatedCollection);
  } else {
    res.status(404).json({ message: "Collection not found" });
  }
};

// delete collection
exports.deleteCollection = (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || "en";
  const deletedCollection = CollectionModel.delete(id, lang);
  if (deletedCollection) {
    res.json(deletedCollection);
  } else {
    res.status(404).json({ message: "Collection not found" });
  }
};
