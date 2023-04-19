import { dataLogger } from '../lib';
import { createPhase, PhaseTask, createStartup } from '../modules';
import { phases, startups } from './dump';

export const seed = () => {
  dataLogger.info('Seeding started...');
  dataLogger.info('Creating Phases and Phase Tasks...');
  phases.forEach(({ name, tasks }) => {
    createPhase({
      name,
      tasks: tasks.map(
        (taskName) =>
          ({
            name: taskName,
          } as PhaseTask)
      ),
    });
  });
  dataLogger.info('Phases and Phase tasks Created Successfully');
  dataLogger.info('Creating Startups...');
  startups.forEach((name) => {
    createStartup({ name });
  });
  dataLogger.info('Startups Created Successfully');
  dataLogger.info('🚀 Seeding Completed');
};
