const collections = [
  {
    id: 1,
    name: { en: "Summer Vibes", ar: "إطلالات صيفية" },
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    description: {
      en: "Fresh summer outfits for a stylish season.",
      ar: "ملابس صيفية عصرية لموسم مليء بالأناقة.",
    },
    value: "summer_vibes",
  },
  {
    id: 2,
    name: { en: "Winter Elegance", ar: "أناقة الشتاء" },
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    description: {
      en: "Cozy and elegant winter wear.",
      ar: "ملابس شتوية دافئة وأنيقة.",
    },
    value: "winter_elegance",
  },
  {
    id: 3,
    name: {
      en: "Streetwear Edition",
      ar: "مجموعة حضرية وعصرية من الملابس الرياضية.",
    },
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    description: {
      en: "Urban and trendy streetwear collection.",
      ar: "ملابس شتوية دافئة وأنيقة.",
    },
    value: "streetwear_edition",
  },
];

class CollectionModel {
  // Get all collections based on language
  static getAll(lang = "en") {
    return collections.map((collection) => ({
      id: collection.id,
      name: collection.name[lang],
      image: collection.image,
      description: collection.description[lang],
      value: collection.value,
    }));
  }

  // Get a single collection based on ID and language
  static getById(id, lang = "en") {
    const collection = collections.find(
      (collection) => collection.id === parseInt(id)
    );
    if (collection) {
      return {
        id: collection.id,
        name: collection.name[lang],
        image: collection.image,
        description: collection.description[lang],
        value: collection.value,
      };
    }
    return null;
  }

  // add new collection
  static add(newCollection) {
    const newId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
    collections.push({
      id: newId,
      name: {
        en: newCollection.name.en,
        ar: newCollection.name.ar,
      },
      image: newCollection.image,
      description: {
        en: newCollection.description.en,
        ar: newCollection.description.ar,
      },
      value: newCollection.value,
    });
    return this.getById(newId);
  }

  // update
  static update(id, updatedData) {
    const index = collections.findIndex(
      (collection) => collection.id === parseInt(id)
    );
    if (index !== -1) {
      collections[index] = {
        ...collections[index],
        name: {
          ...collections[index].name,
          ...updatedData.name,
        },
        image: updatedData.image || collections[index].image,
        description: {
          ...collections[index].description,
          ...updatedData.description,
        },
        value: updatedData.value || collections[index].value,
      };
      return this.getById(id);
    }
    return null;
  }

  // delete
  static delete(id) {
    const index = collections.findIndex(
      (collection) => collection.id === parseInt(id)
    );
    if (index !== -1) {
      const deletedCollection = collections.splice(index, 1)[0];
      return deletedCollection;
    }
    return null;
  }
}

module.exports = CollectionModel;
