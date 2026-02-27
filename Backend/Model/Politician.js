import mongoose from "mongoose";

const politicianSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  party: {
    type: String,
    required: true,
    enum: ["SLPP", "SJB", "NPP", "UNP", "Other"]
  },

  district: {
    type: String,
    required: true
  },

  position: {
    type: String,
    default: "Member of Parliament"
  },

  bio: String,

  profileImageUrl: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{ timestamps: true }
);

export default mongoose.model("Politician", politicianSchema);