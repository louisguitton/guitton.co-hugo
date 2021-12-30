// Ref: https://spacejelly.dev/posts/how-to-use-the-github-graphql-api-to-add-your-pinned-repositories-in-next-js-react/
// Ref: https://docs.github.com/en/graphql/overview/explorer
// Ref: https://resume.github.io/?louisguitton
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import moment from "moment";
import { CORE_PR_FIELDS, PRQuery } from "../../../lib/github-graphql-fragments";
import type { NextApiRequest, NextApiResponse } from "next";

type ContributionsQuery = {
  search: {
    edges: {
      cursor: string;
      node: PRQuery;
    }[];
  };
};

type Data = {
  createdAt: string;
  repository: string;
  repositoryDescription: string;
  title: string;
  url: string;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const limit = parseInt(req.query.limit as string) || 20;

  const today = moment().format("YYYY-MM-DD");
  const lastYear = moment().subtract(1, "year").format("YYYY-MM-DD");
  const query = `author:louisguitton is:pr merged:${lastYear}..${today}`;

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

  const { data } = await client.query<ContributionsQuery>({
    variables: { limit },
    query: gql`
      ${CORE_PR_FIELDS}
      query GetPRContributions($limit: Int) {
        search(
          query: "${query}"
          type: ISSUE
          first: $limit
        ) {
          edges {
            cursor
            node {
              ... on PullRequest {
                ...CorePRFields
              }
            }
          }
        }
      }
    `,
  });

  // TODO: handle pagination
  const { search } = data;
  const pullRequests = search.edges.map((edge) => ({
    createdAt: edge.node.createdAt,
    repository: edge.node.repository.nameWithOwner,
    repositoryDescription: edge.node.repository.description,
    title: edge.node.title,
    url: edge.node.url,
  }));

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json(pullRequests);
}
