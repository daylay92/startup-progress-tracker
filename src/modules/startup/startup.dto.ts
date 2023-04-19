import { IsArray, IsOptional, IsString } from 'class-validator';
import { Startup } from './models';

export class GetStartupDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  select?: (keyof Startup)[];
}

export class CreateStartupDto {
  @IsString()
  name: string;
}

export class RemoveStartupDto {
  @IsString()
  id: string;
}

export class UpdateStartupDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class CompleteStartupPhaseTaskDto {
  @IsString()
  taskId: string;

  @IsString()
  startupId: string;
}

export class UndoTaskDto extends CompleteStartupPhaseTaskDto {}

export class GetStartupProgressDto extends RemoveStartupDto {}
