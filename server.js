require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { graphqlUploadExpress } from "graphql-upload";
import { getUser, protectResolver } from "./users/users.utils";
import express from "express";
import logger from "morgan";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });

  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  server.applyMiddleware({ app }); // applyMiddleware 는 logger 다음에 실행
  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${server.graphqlPath}`);
};
startServer();

const x = (resolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "LogIn pls",
    };
  }

  return resolver(root, args, context, info);
};
