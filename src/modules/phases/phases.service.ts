import { ConflictError, NotFoundError } from '../../lib';
import { Phase, PhaseTask } from './models';
import {
  getOnePhaseByName,
  createPhase,
  getOnePhase,
  getOnePhaseTask,
  getPhaseTaskSameName,
  createPhaseTask,
  updatePhase,
  updatePhaseTask,
  removePhaseTask,
  getOnePhaseTasks,
  removePhase,
} from './phases.dao';
import {
  CreatePhaseDto,
  CreatePhaseTaskDto,
  DeleteRecordDto,
  GetSingleDto,
  ModifyRecordDto,
} from './phases.dto';

export const createOnePhase = ({ name, tasks }: CreatePhaseDto): Phase => {
  const phase = getOnePhaseByName(name);
  if (phase) throw new ConflictError('A phase with the same name already exists');
  // format the tasks
  const formattedTasks: Partial<PhaseTask>[] = tasks?.map((taskName) => ({
    name: taskName.toLowerCase(),
  }));
  return createPhase({ name, tasks: formattedTasks as PhaseTask[] });
};

export const createTask = ({ name, phaseId }: CreatePhaseTaskDto): PhaseTask => {
  const phase = getOnePhase({ id: phaseId });
  if (!phase) throw new NotFoundError('Task with id was not found');
  const phaseTaskWithSameName = getPhaseTaskSameName(name, phaseId);
  if (phaseTaskWithSameName)
    throw new ConflictError('A task with the same name already exists for the specified phase');
  return createPhaseTask({ phase, name });
};

export const getPhase = ({ id, select }: GetSingleDto<Phase>): Phase => {
  const phase = getOnePhase({ id, select });
  if (!phase) throw new NotFoundError('Phase with id was not found');
  return phase;
};

export const getPhaseTask = ({ id, select }: GetSingleDto<PhaseTask>): PhaseTask => {
  const phaseTask = getOnePhaseTask({ id, select });
  if (!phaseTask) throw new NotFoundError('PhaseTask with id was not found');
  return phaseTask;
};

export const getTasksByPhaseId = ({ id, select }: GetSingleDto<PhaseTask>): PhaseTask[] => {
  const phase = getOnePhase({ id });
  if (!phase) throw new NotFoundError('Phase with id was not found');
  return getOnePhaseTasks(id, select);
};

export const modifyPhase = ({ id, name }: ModifyRecordDto): Phase => {
  const phase = getOnePhase({ id });
  if (!phase) throw new NotFoundError('Phase with id was not found');
  const existingPhaseWithSameName = getOnePhaseByName(name);
  const isSamePhase = existingPhaseWithSameName === phase;
  if (existingPhaseWithSameName && !isSamePhase)
    throw new ConflictError('A phase with the same name already exists');
  return isSamePhase ? phase : updatePhase(phase, { name });
};

export const modifyPhaseTask = ({ id, name }: ModifyRecordDto): PhaseTask => {
  const phaseTask = getOnePhaseTask({ id });
  if (!phaseTask) throw new NotFoundError('Task with id was not found');
  const existingPhaseTaskWithSameName = getPhaseTaskSameName(name, phaseTask.phase.id);
  const sameTask = existingPhaseTaskWithSameName === phaseTask;
  if (existingPhaseTaskWithSameName && !sameTask)
    throw new ConflictError('A task with this name already exists for the same phase');
  return updatePhaseTask(phaseTask, { name });
};

export const removeOnePhase = async ({ id }: DeleteRecordDto): Promise<boolean> => {
  const phase = getOnePhase({ id });
  if (!phase) throw new NotFoundError('Phase with id was not found');
  await removePhase(phase);
  return true;
};

export const removeTask = async ({ id }: DeleteRecordDto): Promise<boolean> => {
  const phaseTask = getOnePhaseTask({ id });
  if (!phaseTask) throw new NotFoundError('Phase task with id was not found');
  await removePhaseTask(phaseTask);
  return true;
};
