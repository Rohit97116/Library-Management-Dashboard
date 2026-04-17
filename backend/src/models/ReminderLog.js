const mongoose = require("mongoose");

const reminderLogSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    cycleYear: {
      type: Number,
      required: true,
    },
    monthKeys: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    simulated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["sent", "skipped", "failed"],
      default: "sent",
    },
    triggeredBy: {
      type: String,
      enum: ["auto", "manual"],
      default: "manual",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

reminderLogSchema.index({ member: 1, sentAt: -1 });

module.exports = mongoose.model("ReminderLog", reminderLogSchema);
