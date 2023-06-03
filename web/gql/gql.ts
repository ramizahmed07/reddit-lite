/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment RegularError on FieldError {\n  field\n  message\n}": types.RegularErrorFragmentDoc,
    "fragment RegularUser on User {\n  id\n  username\n  email\n}": types.RegularUserFragmentDoc,
    "mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    id\n    title\n    text\n    votes\n    userId\n    user {\n      username\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DownvotePost($downvoteId: Int!) {\n  downvote(id: $downvoteId)\n}": types.DownvotePostDocument,
    "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}": types.ForgotPasswordDocument,
    "mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($options: RegisterUserInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpvotePost($upvoteId: Int!) {\n  upvote(id: $upvoteId)\n}": types.UpvotePostDocument,
    "query Me {\n  me {\n    id\n    username\n    email\n  }\n}": types.MeDocument,
    "query GetPosts($limit: Int!, $cursor: Int) {\n  posts(limit: $limit, cursor: $cursor) {\n    id\n    title\n    textSnippet\n    text\n    votes\n    voteStatus\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n}": types.GetPostsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RegularError on FieldError {\n  field\n  message\n}"): (typeof documents)["fragment RegularError on FieldError {\n  field\n  message\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RegularUser on User {\n  id\n  username\n  email\n}"): (typeof documents)["fragment RegularUser on User {\n  id\n  username\n  email\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation ChangePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    id\n    title\n    text\n    votes\n    userId\n    user {\n      username\n    }\n  }\n}"): (typeof documents)["mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    id\n    title\n    text\n    votes\n    userId\n    user {\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DownvotePost($downvoteId: Int!) {\n  downvote(id: $downvoteId)\n}"): (typeof documents)["mutation DownvotePost($downvoteId: Int!) {\n  downvote(id: $downvoteId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"): (typeof documents)["mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: RegisterUserInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Register($options: RegisterUserInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpvotePost($upvoteId: Int!) {\n  upvote(id: $upvoteId)\n}"): (typeof documents)["mutation UpvotePost($upvoteId: Int!) {\n  upvote(id: $upvoteId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    id\n    username\n    email\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    username\n    email\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPosts($limit: Int!, $cursor: Int) {\n  posts(limit: $limit, cursor: $cursor) {\n    id\n    title\n    textSnippet\n    text\n    votes\n    voteStatus\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetPosts($limit: Int!, $cursor: Int) {\n  posts(limit: $limit, cursor: $cursor) {\n    id\n    title\n    textSnippet\n    text\n    votes\n    voteStatus\n    user {\n      id\n      username\n    }\n    createdAt\n    updatedAt\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;