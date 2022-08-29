const router = require("express").Router();
const { auth, admin, authVendor } = require("../middleware/validation");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
// Create
router.post("/", auth, async (req, res) => {

  // referral receiving 5%
  if (req.user.referral) {
    User.findOne({ referral_ID: req.user.referral }).then((user) => {
      user.referral_balance += 0.05 * req.body.amount;
      req.user.referral = ''
      req.user.save()
      user.save();
    });
  }
  
  const newOrder = new Order({
    ...req.body,
    user: req.user._id,
  });
  try {
    const savedOrder = await newOrder.save();
    const id = savedOrder.products[0].productId;

    // Vendor Receiving 3%
    Product.findById(id)
      .then((product) => User.findById(product.user))
      .then((user) =>{
        user.balance += 0.03 * req.body.amount;
        user.save();
      });

    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update an Order
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a Order
router.delete("/:id", auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has Been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User Order
router.get("/find/:userId", admin, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All orders
router.get("/", authVendor, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Monthly Income

router.get("/income", authVendor, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          salees: "$amount",
        },
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
