import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteProjectQueryDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
