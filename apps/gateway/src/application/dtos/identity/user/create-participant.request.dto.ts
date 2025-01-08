import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateParticipantRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
