import { ResponseDto } from 'libs/interfaces';
import { GetUserResponsePayload } from '../get-user/get-user.response.dto';

export class MeResponseDto implements ResponseDto<GetUserResponsePayload> {
  success: boolean;
  message?: string;
  data?: GetUserResponsePayload;
}
