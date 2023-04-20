import { nanoid } from 'nanoid';
import { startupRepository, startupProgressRepository, phaseTasksRepository } from '../../database';
import { GetMany, GetOneData } from '../../general-types';
import {
  addDates,
  ConflictError,
  NotFoundError,
  selectExactFields,
  ValidationError,
} from '../../lib';
import { PhaseTask } from '../phases';
import { Startup, StartupProgress } from './models';
import { StartupPhaseProgress, StartupPhaseProgressBreakdown } from './startup.types';

export const createStartup = ({ name }: Partial<Startup>): Startup => {
  const startup = new Startup();
  startup.id = nanoid();
  startup.name = name?.toLowerCase()!;
  addDates(startup);
  startupRepository.push(startup);
  return startup;
};

export const getOneStartup = ({ id, select = [] }: GetOneData<Startup>): Startup | undefined => {
  const startup = startupRepository.find((startup) => startup.id === id);
  return startup && select.length ? selectExactFields(select, startup) : startup;
};
export const getStartupByName = (name: string): Startup | undefined =>
  startupRepository.find((startup) => startup.name === name?.toLowerCase());

export const removeStartup = (startup: Startup): void => {
  const index = startupRepository.findIndex((s) => s === startup);
  if (index !== -1) {
    startupRepository.splice(index, 1);
    // remove startup activities
    const startupProgressIndex = startupProgressRepository.findIndex(
      (startupProgress) => startupProgress.startup === startup
    );
    if (startupProgressIndex !== -1) startupProgressRepository.splice(startupProgressIndex, 1);
  } else throw new NotFoundError('startup does not exist');
};

export const updateStartup = (
  startup: Startup,
  data: Partial<Startup>,
  select: (keyof Startup)[] = []
): Startup => {
  if (!startupRepository.find((s) => s === startup))
    throw new NotFoundError('startup does not exist');
  Object.assign(startup, { ...data, updatedAt: new Date() });
  return getOneStartup({
    id: startup.id,
    select,
  }) as Startup;
};

export const getStartups = ({ term, select = [] }: GetMany<Startup>): Startup[] => {
  const startups = term
    ? startupRepository.filter((startup) => startup.name?.includes(term?.toLowerCase()))
    : [...startupRepository];
  if (select.length) return startups.map((startup) => selectExactFields(select, startup));
  return startups;
};

export const getStartupProgress = async (startup: Startup): Promise<StartupPhaseProgress> => {
  const progress = startupProgressRepository.find(
    (startupProgress) => startupProgress.startup === startup
  );
  const completedTasks = progress?.completedPhaseTasks || [];
  // Format tasks with completed status
  const phaseTasks = phaseTasksRepository.map((phaseTask) => {
    const result = {
      ...phaseTask,
      completed: false,
    };
    if (completedTasks.includes(phaseTask)) result.completed = true;
    return result;
  });
  // Format phases each task belongs to.
  const phases: StartupPhaseProgressBreakdown[] = phaseTasks.reduce(
    (acc: StartupPhaseProgressBreakdown[], phaseProgress) => {
      const { phase, ...rest } = phaseProgress;
      const existingPhaseIndex = acc.findIndex((progress) => progress.phaseId === phase.id);
      if (existingPhaseIndex !== -1) acc[existingPhaseIndex].tasks.push(rest);
      else
        acc.push({
          phaseId: phase.id,
          phaseName: phase.name,
          order: phase.order,
          completed: false,
          tasks: [rest],
        });
      return acc;
    },
    [] as StartupPhaseProgressBreakdown[]
  );
  return Promise.resolve(
    phases
      .map((phase) => ({
        ...phase,
        completed: phase.tasks.every(({ completed }) => completed),
      }))
      .sort((a, b) => a.order - b.order)
  );
};

export const completeTask = async (
  task: PhaseTask,
  startup: Startup
): Promise<StartupPhaseProgress> => {
  // check if startup has completed any tasks.
  let startupProgress = startupProgressRepository.find(
    (startupProgress) => startupProgress.startup === startup
  );
  console.log(startupProgress);
  if (!startupProgress) {
    startupProgress = new StartupProgress();
    startupProgress.completedPhaseTasks = [task];
    startupProgress.id = nanoid();
    addDates(startupProgress);
    startupProgress.startup = startup;
  } else {
    // check if task was already completed
    const completed = !!startupProgress.completedPhaseTasks.find(
      (completedTask) => completedTask === task
    );
    if (completed) throw new ConflictError('Task already completed');
    startupProgress.completedPhaseTasks.push(task);
  }
  startupProgressRepository.push(startupProgress);
  return getStartupProgress(startup);
};

export const undoTask = async (
  task: PhaseTask,
  startup: Startup
): Promise<StartupPhaseProgress> => {
  const startupProgress = startupProgressRepository.find(
    (startupProgress) => startupProgress.startup === startup
  );
  if (!startupProgress) throw new ValidationError('Startup has not completed any tasks');
  const { completedPhaseTasks } = startupProgress;
  // check that task exists as completed for the startup
  const taskIndex = completedPhaseTasks.findIndex((completedTask) => completedTask === task);
  if (taskIndex === -1) throw new ValidationError('Task was not completed, hence cannot be undo');
  // determine and remove all tasks related to phases unlocked after the phase of current task was completed
  const nonAffectedTasks = completedPhaseTasks.filter(
    (completedPhaseTask) =>
      completedPhaseTask.phase.order <= task.phase.order && task !== completedPhaseTask
  );
  // update startup progress with non-affected task list
  startupProgress.completedPhaseTasks.splice(0, completedPhaseTasks.length, ...nonAffectedTasks);
  return getStartupProgress(startup);
};
