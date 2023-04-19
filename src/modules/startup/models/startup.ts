import { BaseModel } from '../../../database';
import { StartupProgress } from './startup-progress';

export class Startup extends BaseModel {
  name: string;
  progress?: StartupProgress[];
}
