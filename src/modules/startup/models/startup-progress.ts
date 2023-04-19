import { BaseModel } from '../../../database';
import { PhaseTask } from '../../phases';
import { Startup } from './startup';

export class StartupProgress extends BaseModel {
  startup: Startup;
  completedPhaseTasks: PhaseTask[];
}
