const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true, minlength: 3, maxlength: 50 },
  description: { type: String, required: true, minlength: 50, maxlength: 200 },
  price: { type: Number, required: true, min: 0, max: 9999 },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// create a model
const Course = mongoose.model("Course", courseSchema);

// export the model
module.exports = Course;
