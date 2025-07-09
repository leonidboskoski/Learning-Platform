const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      required: [true, "USER_VALIDATION_USERTYPE_REQUIRED"],
      enum: ["Teacher", "Student"],
    },
    email: {
      type: String,
      required: [true, "USER_VALIDATION_EMAIL_REQUIRED"],
      unique: true,
      match: [/.+@.+\..+/, "USER_VALIDATION_EMAIL_INVALID"],
    },
    password: {
      type: String,
      required: [true, "USER_VALIDATION_PASSWORD_REQUIRED"],
    },
    name: {
      type: String,
      required: [true, "USER_VALIDATION_NAME_REQUIRED"],
    },
    // --- Fields specific to 'Teacher' userType ---
    bio: {
      type: String,
      default: "",
    },
    subjects: {
      type: [Mongoose.Schema.Types.ObjectId],
      ref: "Subject",
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    achievements: {
      type: [String],
      default: [],
    },
    // --- Fields specific to 'Student' userType ---
    highSchoolUniversity: {
      type: String,
      default: "",
    },
    //Bonus Credits
    bonusCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User',userSchema)

module.exports = User