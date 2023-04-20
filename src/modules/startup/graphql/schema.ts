// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const startupTypeDef = gql`
  type Startup {
    id: ID!
    name: String!
    progress: [StartupPhaseProgressBreakdown!]!
    createdAt: Date
    updatedAt: Date
  }

  type StartupTaskBreakdown {
    id: ID!
    name: String!
    completed: Boolean!
  }

  type StartupPhaseProgressBreakdown {
    phaseName: String!
    phaseId: ID!
    order: Int!
    tasks: [StartupTaskBreakdown!]!
    completed: Boolean!
  }

  type Query {
    getStartups(term: String): [Startup]!
    getStartup(id: ID!): Startup!
    getStartupProgress(id: ID!): [StartupPhaseProgressBreakdown!]!
  }

  type Mutation {
    createStartup(name: String!): Startup!
    removeStartup(id: ID!): Boolean!
    updateStartup(id: ID!, name: String!): Startup!
    completeTask(taskId: ID!, startupId: ID!): [StartupPhaseProgressBreakdown!]!
    updoTask(taskId: ID!, startupId: ID!): [StartupPhaseProgressBreakdown!]!
  }
`;
