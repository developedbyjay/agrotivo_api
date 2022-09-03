// const { upload_image } = require("../controller/upload");
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/validation");
const jwt = require("jsonwebtoken");

// Creation of the user
// router.post("/", upload_image.single("image"), async (req, res) => {

//   const fileName = req.file.filename;
//   const basePath = `${req.protocol}://${req.get("host")}/user/uploads/`;
//   try {
//     const newUser = new User({
//       ...req.body,
//       image: `${basePath}${fileName}`,
//     });
//     const user = await newUser.save();
//     const token = await jwt.sign({ _id: user._id.toString() }, "TOKEN");
//     user.tokens = user.tokens.concat({ token });
//     await user.save();
//     res.status(201).json({ user, token });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.post("/", async (req, res) => {
  const { ref } = req.query;
  let link = ref;
  if (!ref) link = "";
  try {
    const newUser = new User({
      ...req.body,
      referral: link,
    });
    const user = await newUser.save();
    const token = await jwt.sign({ _id: user._id.toString() }, "TOKEN");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login routes
router.post("/login", async (req, res) => {
  try {

    const user = await User.findOne({ email:req.body.email });
    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch =  await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    const token = await jwt.sign({ _id: user._id.toString() }, "TOKEN");
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// logout
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send("User Has been logged Out");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
