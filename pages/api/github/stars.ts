// Ref: https://spacejelly.dev/posts/how-to-use-the-github-graphql-api-to-add-your-pinned-repositories-in-next-js-react/
// Ref: https://docs.github.com/en/graphql/overview/explorer
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  FULL_REPO_FIELDS,
  FullRepoQuery,
} from "../../../lib/github-graphql-fragments";
import type { NextApiRequest, NextApiResponse } from "next";

type RepoLanguage = {
  color: string;
  name: string;
};

type StarredRepo = {
  starredAt: string;
  name: string;
  description: string;
  url: string;
  ownerType: string;
  topics: string[];
  languages: RepoLanguage[];
};

type Data = StarredRepo[];

type StarredRepoQuery = {
  user: {
    starredRepositories: {
      edges: {
        starredAt: string;
        cursor: string;
        node: FullRepoQuery;
      }[];
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cursor = (req.query.cursor as string) || "";
  const limit = parseInt(req.query.limit as string) || 10;

  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { data } = await client.query<StarredRepoQuery>({
    variables: { limit, cursor },
    query: gql`
      ${FULL_REPO_FIELDS}
      query GetStarredRepos($limit: Int, $cursor: String) {
        user(login: "louisguitton") {
          starredRepositories(
            first: $limit
            orderBy: { field: STARRED_AT, direction: DESC }
            after: $cursor
          ) {
            edges {
              starredAt
              cursor
              node {
                ...FullRepoFields
              }
            }
          }
        }
      }
    `,
  });

  const { user } = data;
  const nextCursor = user.starredRepositories.edges[limit - 1].cursor;
  console.log(nextCursor);
  const stars = user.starredRepositories.edges.map((edge) => ({
    starredAt: edge.starredAt,
    name: edge.node.nameWithOwner,
    description: edge.node.description,
    url: edge.node.url,
    ownerType: edge.node.owner.__typename,
    topics: edge.node.repositoryTopics.nodes.map((topic) => topic.topic.name),
    languages: edge.node.languages.edges.map((language) => ({
      color: language.node.color,
      name: language.node.name,
    })),
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json(stars);
}
