const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    saveBooks: [Book]
}

type Book {
    _id: ID!
    authors: [String]
    bookId: String!
    description: String
    image: String
    link: String
    title: String!
}

input saveBook {
    authors: [String]
    bookId: String!
    description: String
    image: String
    link: String
    title: String!
}

type Query {
    me: User
}

type Auth {
    ok: Boolean!     
    token: ID!
    user: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: saveBook!): User
    removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;
