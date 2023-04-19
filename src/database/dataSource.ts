import { Phase, PhaseTask } from '../modules/phases';
import { Startup } from '../modules/startup/models/startup';
import { StartupProgress } from '../modules/startup/models/startup-progress';

export const phasesRepository: Phase[] = [];
export const phaseTasksRepository: PhaseTask[] = [];
export const startupRepository: Startup[] = [];
export const startupProgressRepository: StartupProgress[] = [];
