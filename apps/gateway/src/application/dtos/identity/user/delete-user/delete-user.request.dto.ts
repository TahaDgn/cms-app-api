import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
