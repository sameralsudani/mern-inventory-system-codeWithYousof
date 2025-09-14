import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "cloudinary";

// Route to add a new Category
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageUrl = await uploadImage(req.file);

    // Check if category already exists with the same name
    let existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, error: "Category already exists" });
    }

    const newCategory = new Category({
      name: name,
      description: description,
      imageUrl: imageUrl,
    });
    const category = await newCategory.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getCategory = async (req, res) => {
  console.log("get category");
  try {
    const categories = await Category.find();
    return res.status(201).json({ success: true, categories });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById({ _id: id });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category Not Found" });
    }

    let imageUrl = category.imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const updateCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { name: name, description: description, imageUrl: imageUrl }
    );

    res.status(201).json({ success: true, updateCategory });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete category with associated products",
      });
    }

    const category = await Category.findByIdAndDelete({ _id: id });
    if (!category) {
      res
        .status(404)
        .json({ success: false, error: "document not found " + error.message });
    }
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error("Error editing category:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

const uploadImage = async (file) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export { addCategory, getCategory, updateCategory, deleteCategory };
