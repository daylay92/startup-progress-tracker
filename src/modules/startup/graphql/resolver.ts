import { GraphQLResolveInfo } from 'graphql';
import { getSelectedFields, validate } from '../../../lib';
import { Startup } from '../models';
import { getOneStartup, getStartupProgress, getStartups } from '../startup.dao';
import {
  CompleteStartupPhaseTaskDto,
  CreateStartupDto,
  GetStartupDto,
  GetStartupProgressDto,
  RemoveStartupDto,
  UndoTaskDto,
  UpdateStartupDto,
} from '../startup.dto';
import {
  completePhaseTask,
  getStartSetProgress,
  getStartup,
  removeOneStartup,
  undoPhaseTask,
  updateOneStartup,
  createOneStartup,
} from '../startup.service';
import { StartupPhaseProgress } from '../startup.types';

export const startupResolvers = {
  Query: {
    getStartups: (
      _parent: unknown,
      { term }: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getSelectedFields<Startup>(info);
      return getStartups({ term, select: selectedField });
    },
    getStartup: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      info: GraphQLResolveInfo
    ) => {
      const selectedField = getSelectedFields<Startup>(info);
      const dto = await validate<GetStartupDto>(
        {
          id: args.id,
          select: selectedField,
        },
        GetStartupDto
      );
      return getStartup(dto);
    },
    getStartupProgress: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<GetStartupProgressDto>(
        {
          id: args.id,
        },
        GetStartupProgressDto
      );
      return getStartSetProgress(dto);
    },
  },

  Mutation: {
    createStartup: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<CreateStartupDto>(args, CreateStartupDto);
      return createOneStartup(dto);
    },
    removeStartup: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<RemoveStartupDto>(args, RemoveStartupDto);
      return removeOneStartup(dto);
    },
    updateStartup: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<UpdateStartupDto>(args, UpdateStartupDto);
      return updateOneStartup(dto);
    },
    completeTask: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<CompleteStartupPhaseTaskDto>(args, CompleteStartupPhaseTaskDto);
      return completePhaseTask(dto);
    },
    updoTask: async (
      _parent: unknown,
      args: Record<string, string>,
      _context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const dto = await validate<UndoTaskDto>(args, UndoTaskDto);
      return undoPhaseTask(dto);
    },
  },

  Startup: {
    progress: async (parent: Omit<Startup, 'progress'> & { progress: StartupPhaseProgress }) =>
      parent?.progress?.phaseBreakdown
        ? parent.progress
        : await getStartupProgress(
            getOneStartup({
              id: parent.id,
            }) as Startup
          ),
  },
};
