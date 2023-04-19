import { PhaseTask } from '../phases';
import { Startup } from './models';

export type StartupTaskBreakdown = Omit<PhaseTask, 'phase'> & { completed: boolean };
export class StartupPhaseProgressBreakdown {
  phaseName: string;
  phaseId: string;
  order: number;
  tasks: StartupTaskBreakdown[];
  completed: boolean;
}
export interface StartupPhaseProgress {
  startup: Startup;
  phaseBreakdown: StartupPhaseProgressBreakdown[];
}
