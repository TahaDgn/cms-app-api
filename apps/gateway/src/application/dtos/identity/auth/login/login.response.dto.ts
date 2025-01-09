import { ResponseDto } from 'libs/interfaces';

export class LoginResponseDto implements ResponseDto {
  success: boolean;

  message?: string;
}
