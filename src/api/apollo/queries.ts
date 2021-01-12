import gql from 'graphql-tag';

export const GET_PROJECT = gql`
  query GetProject($projectId: UUID!) {
    project(id: $projectId) {
      id
      persist
      mutable
      parentId
      seed
      title
      accounts {
        id
        address
        draftCode
        deployedCode
        deployedContracts
        state
      }
      transactionTemplates {
        id
        script
        title
      }
      scriptTemplates {
        id
        script
        title
      }
    }
  }
`;

export const GET_LOCAL_PROJECT = gql`
  query GetLocalProject {
    project: localProject @client {
      id
      persist
      mutable
      parentId
      seed
      title
      accounts {
        id
        address
        draftCode
        deployedCode
        deployedContracts
        state
      }
      transactionTemplates {
        id
        script
        title
      }
      scriptTemplates {
        id
        script
        title
      }
    }
  }
`;

export const GET_ACTIVE_PROJECT = gql`
  query GetActiveProject {
    activeProjectId @client
    activeProject @client
  }
`;

export const GET_EXECUTION_RESULTS = gql`
  fragment ExecutionResultDetails on ExecutionResult {
    timestamp
    tag
    value
  }

  query GetCachedExecutionResults {
    cachedExecutionResults @client {
      TRANSACTION {
        ...ExecutionResultDetails
      }
      SCRIPT {
        ...ExecutionResultDetails
      }
      CONTRACT {
        ...ExecutionResultDetails
      }
    }
  }
`;

export const getCachedExecutionResults = () => {
  return gql`
    query GetCachedResults {
      cachedExecutionResults @client {
        TRANSACTION {
          timestamp
          tag
          value
          label
        }
        SCRIPT {
          timestamp
          tag
          value
          label
        }
        CONTRACT {
          timestamp
          tag
          value
          label
        }
      }
    }
  `;
};
