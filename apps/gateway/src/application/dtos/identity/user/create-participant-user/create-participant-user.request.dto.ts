import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

class Payload {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CreateParticipantRequestDto {
  createPayload: Payload;
}
