import { Project, TicketStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class Payload implements Pick<Project, 'title' | 'description' | 'status'> {
  @MaxLength(80)
  @MinLength(10)
  @IsString()
  @IsOptional()
  @Expose()
  title: string;

  @MaxLength(1000)
  @MinLength(10)
  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @IsIn(Object.values(TicketStatus))
  @IsOptional()
  @Expose()
  status: TicketStatus;
}

export class UpdateProjectRequestDto implements Pick<Project, 'id'> {
  @Min(0)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id: number;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Payload)
  @Expose()
  updatePayload: Payload;
}
