import { GraphQLResolveInfo, Kind, GraphQLScalarType } from 'graphql';
import { getCustomizeSelection, validate } from '../../../lib';
import { Phase, PhaseTask } from '../models';
import { getOnePhaseTasks, getPhases } from '../phases.dao';
import {
  CreatePhaseDto,
  CreatePhaseTaskDto,
  GetSingleDto,
  ModifyRecordDto,
  DeleteRecordDto,
} from '../phases.dto';
import {
  createOnePhase,
  createTask,
  getPhase,
  getPhaseTask,
  getTasksByPhaseId,
  modifyPhase,
  modifyPhaseTask,
  removeOnePhase,
  removeTask,
} from '../phases.service';

export const phaseResolvers = {
  Query: {
    phases: (
      _parent: unknown,
      { term }: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getCustomizeSelection<Phase>(info);
      return getPhases({ term, select: selectedField });
    },
    getPhase: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getCustomizeSelection<Phase>(info);
      const dto = await validate<GetSingleDto<Phase>>(
        {
          id: args.id,
          select: selectedField,
        },
        GetSingleDto<Phase>
      );
      return getPhase(dto);
    },
    getTasksByPhaseId: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getCustomizeSelection<PhaseTask>(info);
      const dto = await validate<GetSingleDto<PhaseTask>>(
        {
          id: args.id,
          select: selectedField,
        },
        GetSingleDto<PhaseTask>
      );
      return getTasksByPhaseId(dto);
    },
    getOnePhaseTask: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getCustomizeSelection<PhaseTask>(info);
      const dto = await validate<GetSingleDto<PhaseTask>>(
        {
          id: args.id,
          select: selectedField,
        },
        GetSingleDto<PhaseTask>
      );
      return getPhaseTask(dto);
    },
  },
  Mutation: {
    createPhase: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<CreatePhaseDto>(args.input, CreatePhaseDto);
      return createOnePhase(dto);
    },
    createPhaseTask: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<CreatePhaseTaskDto>(args.input, CreatePhaseTaskDto);
      return createTask(dto);
    },
    updatePhase: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<ModifyRecordDto>(args.input, ModifyRecordDto);
      return modifyPhase(dto);
    },
    updatePhaseTask: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<ModifyRecordDto>(args.input, ModifyRecordDto);
      return modifyPhaseTask(dto);
    },
    removePhase: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<DeleteRecordDto>(args.input, DeleteRecordDto);
      return removeOnePhase(dto);
    },
    removePhaseTask: async (
      _parent: unknown,
      args: Record<string, any>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<DeleteRecordDto>(args.input, DeleteRecordDto);
      return removeTask(dto);
    },
  },
  Phase: {
    tasks: (parent: Phase) => (parent?.tasks?.length ? parent?.tasks : getOnePhaseTasks(parent.id)),
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: Date) {
      return value.toISOString();
    },
    parseValue(value: string) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) return new Date(parseInt(ast.value, 10));
      else if (ast.kind === Kind.STRING) return new Date(ast.value);
      return null;
    },
  }),
};
