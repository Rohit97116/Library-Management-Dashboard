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

function cloneMapLike(source) {
  if (!source) {
    return new Map();
  }

  if (source instanceof Map) {
    return new Map(source);
  }

  if (typeof source.toObject === "function") {
    return new Map(Object.entries(source.toObject()));
  }

  if (typeof source === "object") {
    return new Map(Object.entries(source));
  }

  return new Map();
}

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
      alias: "joinDate",
    },
    monthlyFee: {
      type: Number,
      required: true,
      min: 0,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
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
    monthlyFees: {
      type: Map,
      of: paymentEntrySchema,
      default: {},
    },
    feeStatus: {
      type: Map,
      of: paymentEntrySchema,
      default: {},
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

memberSchema.pre("validate", function syncLegacyFields(next) {
  const normalizedPhone = (this.phoneNumber || this.phone || "").trim();
  if (normalizedPhone) {
    this.phoneNumber = normalizedPhone;
    this.phone = normalizedPhone;
  }

  const canonicalFees = this.monthlyFees?.size
    ? cloneMapLike(this.monthlyFees)
    : this.feeStatus?.size
      ? cloneMapLike(this.feeStatus)
      : this.payments?.size
        ? cloneMapLike(this.payments)
        : null;

  if (canonicalFees) {
    this.monthlyFees = cloneMapLike(canonicalFees);
    this.feeStatus = cloneMapLike(canonicalFees);
    this.payments = cloneMapLike(canonicalFees);
  }

  next();
});

memberSchema.index({ createdAt: 1, _id: 1 });

module.exports = mongoose.model("Member", memberSchema);
