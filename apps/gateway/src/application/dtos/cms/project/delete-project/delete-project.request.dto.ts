import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteProjectRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
