import { nanoid } from 'nanoid';
import { phasesRepository, phaseTasksRepository, startupProgressRepository } from '../../database';
import { GetMany, GetOneData } from '../../general-types';
import { addDates, NotFoundError, selectExactFields } from '../../lib';
import { Phase, PhaseTask } from './models';

export const createPhaseTask = (data: Partial<PhaseTask>): PhaseTask => {
  const task = new PhaseTask();
  task.id = nanoid();
  task.name = data.name?.toLowerCase()!;
  addDates(task);
  task.phase = data.phase!;
  phaseTasksRepository.push(task);
  return task;
};

export const createPhase = (data: Partial<Phase>): Phase => {
  const phase = new Phase();
  phase.id = nanoid();
  phase.name = data.name?.toLowerCase()!;
  addDates(phase);
  // determine order number of new phase
  phase.order = phaseTasksRepository.length
    ? phasesRepository[phasesRepository.length - 1].order + 1
    : 1;
  phasesRepository.push(phase);
  const { tasks } = data;
  // Add tasks for phase
  if (tasks?.length) phase.tasks = tasks.map((task) => createPhaseTask({ ...task, phase }));
  return phase;
};

export const getOnePhase = ({ id, select = [] }: GetOneData<Phase>): Phase | undefined => {
  const phase = phasesRepository.find((phase) => phase.id === id);
  return phase && select.length ? selectExactFields(select, phase) : phase;
};

export const getOnePhaseByName = (name: string): Phase | undefined =>
  phasesRepository.find((phase) => phase.name === name.toLowerCase());

export const getPhaseTaskSameName = (name: string, phaseId: string): PhaseTask | undefined =>
  phaseTasksRepository.find(
    (task) => task.name === name.toLowerCase() && task.phase.id === phaseId
  );

export const getOnePhaseTask = ({
  id,
  select = [],
}: GetOneData<PhaseTask>): PhaseTask | undefined => {
  const task = phaseTasksRepository.find((task) => task.id === id);
  return task && select.length ? selectExactFields(select, task) : task;
};

export const getOnePhaseTasks = (id: string, select: (keyof PhaseTask)[] = []): PhaseTask[] =>
  (phaseTasksRepository.filter((task) => task.phase.id === id) || []).map((task) =>
    selectExactFields(select, task)
  );

export const updatePhaseTask = (
  task: PhaseTask,
  data: Partial<PhaseTask>,
  select: (keyof PhaseTask)[] = []
): PhaseTask => {
  if (!phaseTasksRepository.find((t) => t === task)) throw new NotFoundError();
  Object.assign(task, { ...data, updatedAt: new Date() });
  return getOnePhaseTask({ id: task.id, select }) as PhaseTask;
};

export const removePhaseTask = async (task: PhaseTask): Promise<void> => {
  const index = phaseTasksRepository.findIndex((t) => t === task);
  if (index !== -1) {
    phaseTasksRepository.splice(index, 1);
    // check if the phase of the current task still have more tasks and delete phase if all tasks have been deleted
    const { phase } = task;
    const relatedTasks = phaseTasksRepository.filter(
      (remainingTask) => remainingTask.phase === phase
    );
    if (!relatedTasks.length) {
      const index = phasesRepository.findIndex((p) => p === phase);
      if (index !== -1) {
        phasesRepository.splice(index, 1);
      }
    } else {
      // clean up delete task from all existing startup activities
      for await (const startupProgress of startupProgressRepository) {
        const taskIndex = startupProgress.completedPhaseTasks.findIndex(
          (completedTask) => completedTask === task
        );
        if (taskIndex !== -1) startupProgress.completedPhaseTasks.splice(taskIndex, 1);
        await Promise.resolve();
      }
    }
  } else throw new NotFoundError();
};

export const removePhase = async (phase: Phase, ignoreTask = false): Promise<void> => {
  const index = phasesRepository.findIndex((p) => p === phase);
  if (index !== -1) {
    // remove all related tasks
    if (!ignoreTask) {
      const remainingTasks = phaseTasksRepository.filter((task) => task.phase !== phase);
      phaseTasksRepository.splice(0, phaseTasksRepository.length, ...remainingTasks);
    }
    // Remove all startup progress tracked
    for await (const startupProgress of startupProgressRepository) {
      const taskIndex = startupProgress.completedPhaseTasks.findIndex(
        (completedTask) => completedTask.phase === phase
      );
      if (taskIndex !== -1) startupProgress.completedPhaseTasks.splice(taskIndex, 1);
      await Promise.resolve();
    }
    phasesRepository.splice(index, 1);
  } else throw new NotFoundError();
};

export const updatePhase = (
  phase: Phase,
  data: Partial<Phase>,
  select: (keyof Phase)[] = []
): Phase => {
  if (!phasesRepository.find((p) => p === phase)) throw new NotFoundError();
  Object.assign(phase, { ...data, updatedAt: new Date() });
  return getOnePhase({ id: phase.id, select }) as Phase;
};

export const getPhases = ({ term, select = [] }: GetMany<Phase>): Phase[] => {
  const phases = term
    ? phasesRepository.filter((phase) => phase.name?.includes(term?.toLowerCase()))
    : [...phasesRepository];
  // sort outcome by order number
  phases?.sort((a, b) => a.order - b.order);
  // select only requested fields
  if (select.length) return phases.map((phase) => selectExactFields(select, phase));
  return phases;
};
