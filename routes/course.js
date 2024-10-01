// Import the express library
const router = require("express").Router();
const { Course } = require("../models");
const { courseValidation } = require("../validation");

router.use((req, res, next) => {
  console.log("It's receiving a request at course route...");
  next();
});

router.post("/", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "Only instructors can create a course. Please log in with an instructor account if you have one."
      );
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    console.log({ title, description, price });
    let savedCourse = await newCourse.save();
    console.log(req.user);
    return res
      .status(200)
      .send({ msg: "The course is have been saved.", savedCourse });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to save the course...");
  }
});

module.exports = router;
