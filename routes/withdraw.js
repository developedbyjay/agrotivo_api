const router = require("express").Router();
const { auth, admin, authVendor } = require("../middleware/validation");

const Withdraw = require("../models/Withdraw");
const User = require("../models/User");
// Create

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.balance + user.referral_balance < req.body.amount)
      return res.status(500).send(`Your Account balance is not sufficient`);

    const newWithdraw = new Withdraw({
      ...req.body,
      user: req.user._id,
    });

    const savedWith = await newWithdraw.save();
    const id = savedWith.user;

    User.findById(id).then((user) => {
      user.balance -= req.body.amount;
      user.history.push({
        type: "Withdraw",
        date: Date.now(),
        amount: req.body.amount,
      });
      user.save();
    });
    res.status(200).json(savedWith);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a withdraw
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedWithdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedWithdraw);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a withdraw
router.delete("/:id", auth, async (req, res) => {
  try {
    await Withdraw.findByIdAndDelete(req.params.id);
    res.status(200).json("Withdraw has Been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User Withdraw
router.get("/find/:userId", admin, async (req, res) => {
  try {
    const order = await Withdraw.find({ user: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Withdraw
router.get("/", admin, async (req, res) => {
  try {
    const withdraw = await Withdraw.find();
    res.status(200).json(withdraw);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
