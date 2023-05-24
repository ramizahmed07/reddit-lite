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
    "fragment RegularUser on User {\n  id\n  username\n}": types.RegularUserFragmentDoc,
    "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($username: String!, $password: String!) {\n  register(username: $username, password: $password) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.RegisterDocument,
    "query Me {\n  me {\n    ...RegularUser\n  }\n}": types.MeDocument,
    "query GetPosts {\n  posts {\n    id\n    title\n  }\n}": types.GetPostsDocument,
    "query GetUsers {\n  users {\n    id\n    username\n  }\n}": types.GetUsersDocument,
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
export function graphql(source: "fragment RegularUser on User {\n  id\n  username\n}"): (typeof documents)["fragment RegularUser on User {\n  id\n  username\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($username: String!, $password: String!) {\n  register(username: $username, password: $password) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Register($username: String!, $password: String!) {\n  register(username: $username, password: $password) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...RegularUser\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...RegularUser\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPosts {\n  posts {\n    id\n    title\n  }\n}"): (typeof documents)["query GetPosts {\n  posts {\n    id\n    title\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUsers {\n  users {\n    id\n    username\n  }\n}"): (typeof documents)["query GetUsers {\n  users {\n    id\n    username\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;