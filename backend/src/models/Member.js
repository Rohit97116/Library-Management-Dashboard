const mongoose = require("mongoose");

const paymentEntrySchema = new mongoose.Schema(
  {
    paid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    monthlyFee: {
      type: Number,
      required: true,
      min: 0,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    payments: {
      type: Map,
      of: paymentEntrySchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
