import { gql } from "@apollo/client"

const lastModified = gql`
  {
    repository(owner: "louisguitton", name: "guitton.co") {
      object(expression: "rewrite") {
        ... on Commit {
          history(path: "README.md", first: 1) {
            edges {
              node {
                commitUrl
                committedDate
              }
            }
          }
        }
      }
    }
  }
`
