import mongoose, { Schema } from "mongoose";

const volunteerWorkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    workFile: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfHours: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const VolunteerWork = mongoose.model(
  "VolunteerWork",
  volunteerWorkSchema
);
