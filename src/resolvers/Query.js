const Link = require("../models/Link");

const info = () => "Tis is an the Api for Hackernews clone";

const feed = async (parent, args, context, info) => await Link.find({});

const link = async (parent, args, context, info) =>
  await Link.findById(args.id);

module.exports = {
  info,
  feed,
  link,
};
