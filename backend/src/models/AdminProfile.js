const mongoose = require("mongoose");

const adminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    libraryName: {
      type: String,
      required: true,
      trim: true,
      default: "Ambey Library",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminProfile", adminProfileSchema);
