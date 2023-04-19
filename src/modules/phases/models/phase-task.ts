import { BaseModel } from '../../../database';
import { Phase } from './phase';

export class PhaseTask extends BaseModel {
  name: string;
  phase: Phase;
}
