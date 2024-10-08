// Import the express library
const router = require("express").Router();
const { registerValidation, loginValidation } = require("../validation");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// middleware
router.use((req, res, next) => {
  console.log("It's receiving a request at auth route");
  next();
});

// routes
router.get("/testAPI", (req, res) => {
  res.send("Successfully accessed the test API");
});

router.post("/register", async (req, res) => {
  // check the info for register
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // // check if the user already exists
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send("User already exists");

  // // create a new user
  let { username, email, password, role } = req.body;
  let newUser = new User({ username, email, password, role });
  try {
    let savedUser = await newUser.save();
    res
      .status(200)
      .send({ msg: "Successfully registered the user!", savedUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Failed to register the user...");
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the email is exists
  let foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("cannot find the user, please check the email");
  }

  // check if the password is correct
  try {
    const isMatch = await foundUser.comparePassword(req.body.password);
    if (isMatch) {
      // create a token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.status(200).send({
        msg: "Successfully logged in!",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("password is wrong");
    }
  } catch (err) {
    console.log("Error login in: ", err);
    return res.status(500).send("Failed to login...");
  }
});

// export the router
module.exports = router;
