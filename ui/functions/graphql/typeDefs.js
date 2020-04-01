const { gql } = require('apollo-server-lambda');

module.exports = gql`
type Joke {
    id: ID!
    setup: String!
    punchline: String!
    thumbsup: Int!
    thumbsdown: Int!
}

type User {
    id: ID!
    username: String!
    role: String!
}

type AuthPayload {
    token: String!
    user: User!
}

input JokeInput {
    id: ID
    setup: String!
    punchline: String!
    thumbsup: Int
    thumbsdown: Int
}

input GetListInput {
    pagination: PaginationInput
    sort: SortInput
    filter: JokeFilters
}

input JokeFilters {
    setup: String
    punchline: String
}

input PaginationInput {
    page: Int
    perPage: Int
}

input SortInput {
    field: String
    order: String
}

type Query {
    getRandomJoke: Joke @cacheControl(maxAge: 0)
    getOneJoke(id: ID!): Joke
    getListJoke(params: GetListInput!): [Joke]
    getManyJoke(ids: [ID!]): [Joke]
    getJokeCount: Int
}

type Mutation {
    authTest: String
    createJoke(joke: JokeInput!): Joke
    updateJoke(id: ID!, joke: JokeInput!): Joke
    updateManyJoke(ids: [ID!]!, updates: JokeInput!): [ID]
    deleteJoke(id: ID!): Joke
    deleteManyJoke(ids: [ID!]!): [ID]
    login(email: String!, password: String!): AuthPayload
}
`