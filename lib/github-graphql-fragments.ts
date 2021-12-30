// GraphQL fragments and assocciated typescript types
// Ref: https://www.apollographql.com/docs/react/data/fragments/

import { gql } from "@apollo/client";

export const CORE_REPO_FIELDS = gql`
  fragment CoreRepoFields on Repository {
    nameWithOwner
    description
  }
`;

export type CoreRepoQuery = {
  nameWithOwner: string;
  description: string;
};

export const CORE_PR_FIELDS = gql`
  ${CORE_REPO_FIELDS}
  fragment CorePRFields on PullRequest {
    repository {
      ...CoreRepoFields
    }
    createdAt
    title
    url
  }
`;

export type PRQuery = {
  repository: CoreRepoQuery;
  createdAt: string;
  title: string;
  url: string;
};

export const FULL_REPO_FIELDS = gql`
  ${CORE_REPO_FIELDS}
  fragment FullRepoFields on Repository {
    ...CoreRepoFields
    updatedAt
    createdAt
    url
    owner {
      login
      url
      __typename
    }
    repositoryTopics(first: 5) {
      nodes {
        topic {
          name
        }
      }
    }
    primaryLanguage {
      name
      color
    }
    languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
      edges {
        size
        node {
          color
          name
        }
      }
    }
  }
`;

export interface FullRepoQuery extends CoreRepoQuery {
  updatedAt: string;
  createdAt: string;
  url: string;
  owner: {
    login: string;
    url: string;
    __typename: string;
  };
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  primaryLanguage: {
    name: string;
    color: string;
  };
  languages: {
    edges: {
      size: number;
      node: {
        color: string;
        name: string;
      };
    }[];
  };
}
