import { Ticket } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  Min,
  IsInt,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  ValidateNested,
} from 'class-validator';

class Payload implements Pick<Ticket, 'projectId' | 'description'> {
  @Min(0)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  projectId: number;

  @MaxLength(1000)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;
}

export class CreateTicketRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Payload)
  @Expose()
  createPayload: Payload;
}
