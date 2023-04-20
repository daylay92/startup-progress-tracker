import { ConflictError, NotFoundError, ValidationError } from '../../lib';
import { getOnePhaseTask } from '../phases/phases.dao';
import { Startup } from './models';
import {
  completeTask,
  getOneStartup,
  getStartupByName,
  getStartupProgress,
  undoTask,
  createStartup,
  removeStartup,
  updateStartup,
} from './startup.dao';
import {
  CompleteStartupPhaseTaskDto,
  UndoTaskDto,
  GetStartupDto,
  CreateStartupDto,
  RemoveStartupDto,
  UpdateStartupDto,
  GetStartupProgressDto,
} from './startup.dto';
import { StartupPhaseProgress } from './startup.types';

export const createOneStartup = ({ name }: CreateStartupDto): Startup => {
  const startup = getStartupByName(name);
  if (startup) throw new ConflictError('Startup with the name already exists');
  return createStartup({ name });
};

export const getStartup = ({ id, select = [] }: GetStartupDto): Startup => {
  const startup = getOneStartup({ id, select });
  if (!startup) throw new NotFoundError('Startup does not exist');
  return startup;
};

export const removeOneStartup = ({ id }: RemoveStartupDto): boolean => {
  const startup = getOneStartup({ id });
  if (!startup) throw new NotFoundError('Startup does not exist');
  removeStartup(startup);
  return true;
};

export const updateOneStartup = ({ id, name }: UpdateStartupDto): Startup => {
  const startup = getOneStartup({ id });
  if (!startup) throw new NotFoundError('Startup does not exist');
  const existingStartupWithName = getStartupByName(name);
  if (existingStartupWithName && startup !== existingStartupWithName)
    throw new ConflictError('Startup with the name already exists');
  return startup === existingStartupWithName
    ? startup
    : updateStartup(startup, { name: name.toLowerCase() });
};

export const getStartSetProgress = async ({
  id,
}: GetStartupProgressDto): Promise<StartupPhaseProgress> => {
  const startup = getOneStartup({ id });
  if (!startup) throw new NotFoundError('Startup does not exist');
  return getStartupProgress(startup);
};

export const completePhaseTask = async ({
  taskId,
  startupId,
}: CompleteStartupPhaseTaskDto): Promise<StartupPhaseProgress> => {
  // check if startup exists, and throw a not found error otherwise
  const startup = getOneStartup({ id: startupId });
  if (!startup) throw new NotFoundError('Startup does not exist');
  // check if taskId belongs to an existing task
  const task = getOnePhaseTask({ id: taskId });
  if (!task) throw new NotFoundError('Task does not exist');
  // check if phase of the specific task has been unlocked
  const phaseBreakdown = await getStartupProgress(startup);
  const unlocked = phaseBreakdown
    .filter(({ order }) => order < task.phase.order)
    .every(({ completed }) => completed);
  if (!unlocked)
    throw new ValidationError(
      'The all tasks of the preceding phase(s) must be completed before the current task can be marked as completed'
    );
  return completeTask(task, startup);
};

export const undoPhaseTask = async ({
  taskId,
  startupId,
}: UndoTaskDto): Promise<StartupPhaseProgress> => {
  // check if startup exists, and throw a not found error otherwise
  const startup = getOneStartup({ id: startupId });
  if (!startup) throw new NotFoundError('Startup does not exist');
  // check if taskId belongs to an existing task
  const task = getOnePhaseTask({ id: taskId });
  if (!task) throw new NotFoundError('Task does not exist');
  return undoTask(task, startup);
};
