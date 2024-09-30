// import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

// create a schema
const userSchema = new Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, minlength: 6, maxlength: 200 },
  password: { type: String, required: true, minlength: 8, maxlength: 128 },
  role: { type: String, enum: ["student", "instructor"], default: "student" },
  createdAt: { type: Date, default: Date.now },
});

// methods
userSchema.methods.isStudent = function () {
  return this.role === "student";
};

userSchema.methods.isInstructor = function () {
  return this.role === "instructor";
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// middleware
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isNew || user.isModified("password")) {
    //hash the password
    const hashValue = await bcrypt.hash(user.password, 10);
    user.password = hashValue;
  }
  next();
});

// create a model
const User = mongoose.model("User", userSchema);

// export the model
module.exports = User;
