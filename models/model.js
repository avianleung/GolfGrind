const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const commentsSchema = mongoose.Schema(
  {
    comment: reqString,
  },
  {
    timestamps: true,
  }
);

const entrySchema = mongoose.Schema(
  {
    caption: reqString,
    date: reqString,
    mediaType: reqString,
    url: reqString,
    comments: [commentsSchema],
  },
  { timestamps: true }
);

module.exports = (mongoose) => {
  const Entries = mongoose.model("entries", entrySchema);

  return Entries;
};
