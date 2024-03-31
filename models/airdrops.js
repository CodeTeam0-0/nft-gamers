const { Schema, Types, model } = require("mongoose");

const airdropSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    isDone: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Airdrop = model("Airdrop", airdropSchema);

module.exports = Airdrop;
