const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  url: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postedById: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
