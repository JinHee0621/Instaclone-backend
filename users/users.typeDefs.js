import { gql } from "apollo-server";

export default gql`
    type User{
        id: String!
        firstNmae: String!
        lastName: String
        userName: String!
        email: String!
        createdAt: String!
        updatedAt: String!
        bio : String
        avatar : String
        following : [User]
        followers : [User]
    }
`