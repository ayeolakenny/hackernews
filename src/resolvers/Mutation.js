const bcrypt = require("bcryptjs");

const Link = require("../models/Link");
const User = require("../models/User");

const post = async (parent, args, context, info) => {
  if (!context.req.session.userId) return false;

  const user = await User.findById(context.req.session.userId);

  if (!user) return false;

  const link = await new Link({
    ...args,
    postedBy: user,
    postedById: user.id,
  }).save();

  context.pubsub.publish("NEW_LINK", link);

  return link;
};

const updateLink = async (parent, args, context, info) => {
  Link.findByIdAndUpdate(args.id, { ...args }, (err) => {
    if (err) return false;
  });
  return Link.findById(args.id);
};

const deleteLink = async (parent, args, context, info) => {
  const link = await Link.findById(args.id);
  await link.remove();
  return Link.find({});
};

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await new User({ ...args, password }).save();

  context.req.session.userId = user.id;

  return user;
};

const login = async (parent, args, context, info) => {
  const user = await User.findOne({ email: args.email });

  if (!user) return false;

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) return false;

  context.req.session.userId = user.id;

  console.log(context.req.session.userId);

  console.log(user);

  return user;
};

module.exports = {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
};
