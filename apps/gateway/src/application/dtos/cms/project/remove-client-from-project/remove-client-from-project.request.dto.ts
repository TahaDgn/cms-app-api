import { Project } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsInt,
  Min,
  IsNumber,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class Payload implements Pick<Project, 'clientUserIds'> {
  @IsInt({ each: true })
  @Min(0, { each: true })
  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  @Expose()
  clientUserIds: number[];
}

export class RemoveClientsFromProjectRequestDto implements Pick<Project, 'id'> {
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
