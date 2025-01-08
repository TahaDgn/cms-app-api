import { ResponseDto } from 'libs/interfaces';

export class RegisterResponseDto implements ResponseDto {
  success: boolean;

  message: string;
}
