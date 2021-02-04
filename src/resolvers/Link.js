const Link = require("../models/Link");

const postedBy = async (parent, args, context, info) =>
  await Link.findById(parent.id).postedBy();

module.exports = {
  postedBy,
};
