import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { ApolloServer, gql } from "apollo-server";
import { Post } from "./entity/Post";
import { USERS } from "./data";
const Chance = require("chance");
var chance = new Chance();

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    bio: String
    age: Int!
    follows: [User]!
    followers: [User]!
    posts: [Post]!
    likes: [Post]!
  }

  type Post {
    content: String!
    auhtor: User!
    timestamp: User
    likes: [User]!
  }

  type Query {
    users: [User]!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    users: async (parent, args, context, info) => {
      return [];
    },
    posts: async (parent, args, context, info) => {
      return [];
    }
  }
};

createConnection()
  .then(async connection => {
    const usersPromises = USERS.map(async u => {
      let user = new User();
      user.username = u.username;
      user.bio = u.bio;
      user.age = u.age;
      user.posts = [];
      return await connection.manager.save(user);
    });

    await Promise.all(usersPromises);

    const userRepo = connection.getRepository(User);
    const postRepo = connection.getRepository(Post);

    const Emma = await userRepo.findOne({ username: "Emma" });
    const John = await userRepo.findOne({ username: "John" });
    const Lara = await userRepo.findOne({ username: "Lara" });
    const Dom = await userRepo.findOne({ username: "Dom" });
    const Park = await userRepo.findOne({ username: "Park" });

    // console.log(Emma, John, Lara, Dom, Park);

    //Everybody follows Emma
    Emma.follows = [Lara, Park];
    Lara.follows = [Emma, Dom];
    John.follows = [Emma];
    Dom.follows = [Emma];
    Park.follows = [Emma, John];

    await connection.manager.save(Emma);
    await connection.manager.save(Lara);
    await connection.manager.save(John);
    await connection.manager.save(Dom);
    await connection.manager.save(Park);

    const EmmasPosts = [
      {
        content: chance.sentence(),
        timestamp: new Date().getTime()
      },
      {
        content: chance.sentence(),
        timestamp: new Date().getTime()
      },
      {
        content: chance.sentence(),
        timestamp: new Date().getTime()
      }
    ];

    for (let post of EmmasPosts) {
      let p = new Post();
      p.content = post.content;
      p.author = Emma;
      p.likes = [Dom, Park];
      await connection.manager.save(p);
    }

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: true,
      introspection: true,
      context: () => ({
        connection
      })
    });

    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch(error => console.log(error));
