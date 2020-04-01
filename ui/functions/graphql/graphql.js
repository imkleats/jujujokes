const { ApolloServer, gql } = require('apollo-server-lambda');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const {mongoDb, models} = require('./db')

const server = ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => {
        const { user } = context.clientContext;
        let role;
        if (user && user.app_metadata && user.app_metadata.roles) {
            role = user.app_metadata.roles[0];
        } else {
            role = 'ANON_GUEST'
        }
        return {
            db: mongoDb,
            models,
            user: {
                role
            }
        }
    }
});

exports.handler = server.createHandler();