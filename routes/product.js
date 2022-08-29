const router = require("express").Router();
const { auth, admin, authVendor } = require("../middleware/validation");
const Product = require("../models/Product");
const { upload_product } = require("../controller/upload");
// Create

router.post(
  "/",upload_product.single("image"),
  authVendor,
  async (req, res) => {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/product/uploads/`;
    const newProduct = new Product({
      ...req.body,
      image: `${basePath}${fileName}`,
      user: req.user._id,
    });
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// Update a Product
router.put("/:id", authVendor, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a Product
router.delete("/:id", authVendor, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("User has Been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get products by options( new, category, all)
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let products;
  try {
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update the Products gallery ( Future Api)
router.put(
  "/gallery/:id",
  upload_product.array("images", 5),
  authVendor,
  async (req, res) => {
    let imagePath = [];
    const files = req.file;
    const basePath = `${req.protocol}://${req.get("host")}/product/uploads/`;
    files.map((file) => {
      imageArr.push(`${basePath}${file.filename}`);
    });
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagePath,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
