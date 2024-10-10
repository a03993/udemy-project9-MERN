// Import the express library
const router = require("express").Router();
const { Course } = require("../models");
const { courseValidation } = require("../validation");
const { v4: uuidv4 } = require("uuid");

router.use((req, res, next) => {
  console.log("It's receiving a request at course route...");
  next();
});

// Get all courses in the system along with their instructors' usernames and emails
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to search for a course by instructors ID
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// Route to search for a course by students ID
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ student: _student_id })
    .populate("student", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// Route to search for a course by its ID
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.find({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (err) {
    res.status(500).send(err);
  }
});

// New a course
router.post("/", async (req, res) => {
  // Check if matches with rule
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
      id: uuidv4(),
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res
      .status(200)
      .send({ msg: "The course is have been saved.", savedCourse });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to save the course...");
  }
});

// Update the course
router.patch("/:_id", async (req, res) => {
  // Check if matches with rule
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // Check if course exists
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(404).send("Course not found, cannot update.");
    }
    // Check if user is instructor
    if (courseFound.instructor.equals(req.user._id)) {
      // Update the course
      let updatedCourse = await Course.findByIdAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res
        .status(200)
        .send({ msg: "The course is have been updated!", updatedCourse });
    } else {
      return res.status(500).send("You are not an instructor.");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Remove the course
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // Check if course exists
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(404).send("Course not found, cannot remove.");
    }
    // Check if user is instructor
    if (courseFound.instructor.equals(req.user._id)) {
      // Remove the course
      await Course.deleteOne({ _id }).exec();
      return res.send("This course has been removed.");
    } else {
      return res.status(500).send("You are not an instructor.");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
