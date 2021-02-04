const { ApolloServer } = require("apollo-server-express");
const Express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const connectRedis = require("connect-redis");
const Redis = require("ioredis");
const { PubSub } = require("apollo-server-express");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
};

(async () => {
  await mongoose.connect("mongodb://localhost:27017/hackernews", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once("open", () => {
    console.log("connected to db");
  });

  const pubsub = new PubSub();

  const server = new ApolloServer({
    typeDefs: fs.readFileSync(
      path.join(__dirname, "schema/schema.graphql"),
      "utf8"
    ),
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      secret: "qwertyuaSDFGZXCVB",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server has started on port 4000`);
  });
})();
