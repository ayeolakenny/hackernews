const User = require("../models/User");

const links = async (parent, args, context) =>
  await User.findById(parent.id).links();

module.exports = {
  links,
};
