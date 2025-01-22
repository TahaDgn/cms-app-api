import { Project } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class Payload implements Pick<Project, 'title' | 'description'> {
  @MaxLength(80)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @MaxLength(1000)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;
}

export class CreateProjectRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Payload)
  @Expose()
  createPayload: Payload;
}
