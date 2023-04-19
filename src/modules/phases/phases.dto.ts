import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  ArrayUnique,
} from 'class-validator';

export class CreatePhaseTaskDto {
  @IsString()
  name: string;

  @IsString()
  phaseId: string;
}
export class CreatePhaseDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayUnique()
  tasks: string[];
}

export class DeleteRecordDto {
  @IsString()
  id: string;
}

export class GetSingleDto<T> {
  @IsString()
  id: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  select?: (keyof T)[];
}

export class ModifyRecordDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
}
