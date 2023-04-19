import { BaseModel } from '../../../database';
import { PhaseTask } from './phase-task';

export class Phase extends BaseModel {
  name: string;
  tasks?: PhaseTask[];
  order: number; // Represents the order of precedence with which a phase leads to another
}
