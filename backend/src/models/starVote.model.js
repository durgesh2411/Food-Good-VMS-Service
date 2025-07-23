import mongoose, { Schema } from "mongoose";

const starVoteSchema = new Schema(
  {
    voter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Ensure one vote per user per volunteer
starVoteSchema.index({ voter: 1, volunteer: 1 }, { unique: true });

export const StarVote = mongoose.model("StarVote", starVoteSchema);
