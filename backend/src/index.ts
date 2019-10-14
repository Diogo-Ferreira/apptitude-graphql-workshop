import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { ApolloServer, gql } from 'apollo-server';
const Chance = require('chance');
var chance = new Chance();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    username: String!
    bio: String
    age: Int!
    follows: [User]!
  }

  type Post {
      content: String!
      auhtor: User!
      timestamp: User
  }

  type Query {
      users: [User]!
  }
`;


const resolvers = {
    Query: {
        users: async (parent, args, context, info) => {
            const { connection } = context;
            const repo = connection.getRepository(User);
            return await repo.find();
        }
    },
    User: {
        follows: async(parent, args, context, info) => {
            const { connection } = context;
            const repo = connection.getRepository(User);
            const user = await repo.findOne(parent.id, { relations: ['follows'] });
            return user.follows || []
        }
    }
};

createConnection().then(async connection => {

    for(let i = 0; i < chance.integer({ min: 10, max: 30 }); i ++)
    {
        let user = new User();
        user.username = chance.name();
        user.bio = chance.sentence();
        user.age = chance.integer({min: 15, max: 60 });
        user.posts = [];
        await connection.manager.save(user)
    }


    const userRepo = connection.getRepository(User);

    const allUsers = await userRepo.find();

    allUsers.forEach(async u => {
        const startIndex = chance.integer({min: 0, max: allUsers.length - 12 });
        const endIndex = chance.integer({ min: 1, max: 10 });
        const luckyOnes = allUsers.filter(_u => _u.id !== u.id).slice(startIndex, endIndex);
        u.follows = luckyOnes;
        return await connection.manager.save(u);
    })

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers, 
        playground: true, 
        introspection: true,
        context: () => ({
            connection,
        })
    });

    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });

}).catch(error => console.log(error));


