// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const phaseTypeDef = gql`
  scalar Date
  type Phase {
    id: ID!
    name: String!
    tasks: [PhaseTask]!
    order: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type PhaseTask {
    id: ID!
    name: String!
    phase: Phase!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    phases(term: String): [Phase]!
    getPhase(id: ID!): Phase!
    getTasksByPhaseId(id: ID!): [PhaseTask]!
    getOnePhaseTask(id: ID!): PhaseTask!
  }

  input CreatePhaseInput {
    name: String!
    tasks: [String!]!
  }
  type Mutation {
    createPhase(input: CreatePhaseInput): Phase!
    createPhaseTask(name: String!, phaseId: ID!): PhaseTask!
    updatePhase(name: String!, id: ID!): Phase!
    updatePhaseTask(name: String!, id: ID!): PhaseTask!
    removePhase(id: ID!): Boolean!
    removePhaseTask(id: ID!): Boolean!
  }
`;
